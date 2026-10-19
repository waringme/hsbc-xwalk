import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * hero — the source's full-width page banner (.header-area): one image, cropped to a
 * 1520×343 band (22.57 % of the width) and clipped at 485px.
 *
 * Authoring rows (xwalk model "hero"):
 *   1. image (+ alt)
 *   2. text (optional rich text, rendered under the image when present)
 * The image is the page's LCP element: it is loaded eagerly.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const pic = block.querySelector('picture') || block.querySelector('img');
  const imgRow = pic ? rows.find((row) => row.contains(pic)) : null;
  const media = document.createElement('div');
  media.className = 'hero-image';
  if (pic) {
    moveInstrumentation(imgRow, media);
    media.append(pic);
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
  }
  const text = document.createElement('div');
  text.className = 'hero-text';
  rows.filter((row) => row !== imgRow && row.textContent.trim()).forEach((row) => {
    moveInstrumentation(row, text);
    text.append(...(row.firstElementChild || row).childNodes);
  });
  block.replaceChildren(media, ...(text.childNodes.length ? [text] : []));
}
