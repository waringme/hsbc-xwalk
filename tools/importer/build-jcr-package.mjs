#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, import/no-dynamic-require */
/**
 * build-jcr-package — packages imported content/*.plain.html for AEM (xwalk) as a FileVault
 * content package: one cq:Page per document under the site root, every referenced source image
 * rehosted as a dam:Asset under the DAM root, image references rewritten to the DAM path.
 *
 *   node tools/importer/build-jcr-package.mjs [--out <dir>] [--version <v>] [page.plain.html…]
 *
 * Site/DAM roots come from .migration/project.json (aemSitePath / aemAssetsFolderPath).
 * html2md + md2jcr are the converters of the excat content-import scripts (EXCAT_IMPORT_SCRIPTS,
 * default: the installed plugin), run against the merged component models — the same chain the
 * product uses. Writes <out>/<name>-<version>.zip and <out>/asset-mapping.json.
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import {
  dirname, join, relative, resolve,
} from 'node:path';
import { pathToFileURL } from 'node:url';

const SCRIPTS = process.env.EXCAT_IMPORT_SCRIPTS
  || '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts';
const project = process.cwd();
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  if (i < 0) return def;
  const [value] = args.splice(i, 2).slice(1);
  return value;
};
const outDir = resolve(opt('--out', 'migration-work/jcr-package'));
const version = opt('--version', new Date().toISOString().slice(0, 10).replace(/-/g, ''));

const req = createRequire(join(SCRIPTS, 'package.json'));
const load = async (id) => import(pathToFileURL(req.resolve(id)).href);
const { html2md } = await load('@adobe/helix-html2md');
const { md2jcr } = await load('@adobe/helix-md2jcr');
const { mergeModels } = await import(pathToFileURL(join(SCRIPTS, 'check-xwalk-jcr.mjs')).href);

const site = Object.values(JSON.parse(readFileSync('.migration/project.json', 'utf8')).sites)[0];
const SITE_ROOT = site.aemSitePath;
const DAM_ROOT = site.aemAssetsFolderPath;
const NAME = `${site.aemSiteName}-content`;
const SILENT = {
  info() {}, debug() {}, trace() {}, warn() {}, error() {},
};
const MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp',
};
const NS = 'xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" '
  + 'xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0" '
  + 'xmlns:dam="http://www.day.com/dam/1.0" xmlns:dc="http://purl.org/dc/elements/1.1/"';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = (args.length ? args.map((p) => resolve(p)) : readdirSync('content', { recursive: true })
  .map(String).filter((p) => p.endsWith('.plain.html')).sort()
  .map((p) => resolve('content', p)));

const { merged } = mergeModels(project);
const work = join(outDir, 'pkg');
rmSync(work, { recursive: true, force: true });
const root = join(work, 'jcr_root');
const write = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
};

/** source image URL → DAM path (source folder structure kept, lower-cased) */
const damPathOf = (url) => {
  const u = new URL(url);
  const rel = decodeURIComponent(u.pathname).replace(/^\/-\/media\//, '').replace(/^\/+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/._-]+/g, '-');
  return `${DAM_ROOT}/${rel}`;
};

const assets = new Map();
const filters = new Set();
const folders = new Set();

for (const file of pages) {
  const rel = relative(resolve('content'), file).replace(/\.plain\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const doc = html.includes('<main') ? html : `<body><main>${html}</main></body>`;
  const markdown = await html2md(doc, { log: SILENT });
  let xml = await md2jcr(markdown, {
    models: merged.models, definition: merged.definition, filters: merged.filters, log: SILENT,
  });
  // rehost every absolute source image referenced by the page
  xml = xml.replace(/https?:\/\/[^"&\s]+?\.(?:jpe?g|png|gif|svg|webp)(?:\?[^"&\s]*)?/gi, (url) => {
    const clean = url.replace(/\?.*$/, '');
    const dam = damPathOf(clean);
    assets.set(clean, dam);
    return dam;
  });
  const pagePath = `${SITE_ROOT}/${rel === 'index' ? '' : rel}`.replace(/\/$/, '');
  write(join(root, pagePath, '.content.xml'), xml);
  filters.add(pagePath);
  // intermediate pages (created only when missing — they sit outside the filter)
  let parent = dirname(pagePath);
  while (parent.startsWith(SITE_ROOT) && parent !== dirname(SITE_ROOT)) {
    const def = join(root, parent, '.content.xml');
    if (!existsSync(def)) {
      const title = parent.split('/').pop().replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
      write(def, `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="cq:Page">\n  <jcr:content cq:template="/libs/core/franklin/templates/page" sling:resourceType="core/franklin/components/page/v1/page" jcr:primaryType="cq:PageContent" jcr:title="${esc(title)}"/>\n</jcr:root>\n`);
    }
    parent = dirname(parent);
  }
  console.log(`page   ${pagePath}`);
}

for (const [url, dam] of assets) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130 Safari/537.36' } });
  if (!res.ok) {
    console.log(`FAIL   ${url} → HTTP ${res.status} (asset not packaged; reference kept as ${dam})`);
    continue;
  }
  const bin = Buffer.from(await res.arrayBuffer());
  const ext = dam.split('.').pop();
  const mime = MIME[ext] || res.headers.get('content-type') || 'application/octet-stream';
  const base = join(root, dam);
  write(join(base, '.content.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="dam:Asset">\n  <jcr:content jcr:primaryType="dam:AssetContent">\n    <metadata jcr:primaryType="nt:unstructured" dc:format="${mime}"/>\n    <related jcr:primaryType="nt:unstructured"/>\n  </jcr:content>\n</jcr:root>\n`);
  write(join(base, '_jcr_content', 'renditions', 'original'), bin);
  write(join(base, '_jcr_content', 'renditions', 'original.dir', '.content.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="nt:file">\n  <jcr:content jcr:primaryType="nt:resource" jcr:mimeType="${mime}"/>\n</jcr:root>\n`);
  filters.add(dam);
  let parent = dirname(dam);
  while (parent.length >= DAM_ROOT.length) {
    folders.add(parent);
    parent = dirname(parent);
  }
  console.log(`asset  ${dam} (${bin.length} bytes)`);
}
for (const folder of folders) {
  const def = join(root, folder, '.content.xml');
  if (!existsSync(def)) {
    write(def, `<?xml version="1.0" encoding="UTF-8"?>\n<jcr:root ${NS} jcr:primaryType="sling:OrderedFolder">\n  <jcr:content jcr:primaryType="nt:unstructured" jcr:title="${esc(folder.split('/').pop())}"/>\n</jcr:root>\n`);
  }
}

const filterXml = `<?xml version="1.0" encoding="UTF-8"?>\n<workspaceFilter version="1.0">\n${[...filters].sort()
  .map((f) => `  <filter root="${esc(f)}"/>`).join('\n')}\n</workspaceFilter>\n`;
write(join(work, 'META-INF', 'vault', 'filter.xml'), filterXml);
write(join(work, 'META-INF', 'vault', 'properties.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">\n<properties>\n  <entry key="name">${NAME}</entry>\n  <entry key="group">${esc(site.aemSiteName)}</entry>\n  <entry key="version">${version}</entry>\n  <entry key="description">Imported content for ${esc(site.aemSiteTitle)} (${pages.length} pages, ${assets.size} assets)</entry>\n  <entry key="requiresRoot">false</entry>\n  <entry key="allowIndexDefinitions">false</entry>\n</properties>\n`);
write(join(outDir, 'asset-mapping.json'), `${JSON.stringify(Object.fromEntries(assets), null, 2)}\n`);

const zip = join(outDir, `${NAME}-${version}.zip`);
rmSync(zip, { force: true });
execFileSync('python3', ['-c', `
import os, sys, zipfile
src, out = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for top in ('META-INF', 'jcr_root'):
        for d, _, files in os.walk(os.path.join(src, top)):
            for f in files:
                p = os.path.join(d, f)
                z.write(p, os.path.relpath(p, src))
`, work, zip]);
console.log(`\npackage ${zip}\nfilter  ${filters.size} roots · ${pages.length} pages · ${assets.size} assets`);
