/* eslint-disable */
/* global WebImporter */

/**
 * Chrome import — builds the /nav and /footer documents from one source page's header and
 * footer (use a page that carries both confirmation templates, e.g. /hsbc-uk/inclusion).
 *
 * /nav sections (the header block's slot contract):
 *   1. skip links  2. divisions  3. brand logo  4. primary nav (+ doormat sub-lists)  5. search
 * /footer sections (the footer block's slot contract):
 *   1. utility links + copyright  2. leaving confirmation  3. e-mail confirmation
 * Copy and hrefs are verbatim; CTAs are authored as <strong> (proceed) / <em> (cancel) links.
 */

function link(document, source, text) {
  const a = document.createElement('a');
  a.href = source.getAttribute('href') || '#';
  a.textContent = (text !== undefined ? text : source.textContent).replace(/\s+/g, ' ').trim();
  return a;
}

function listOf(document, anchors) {
  const ul = document.createElement('ul');
  anchors.forEach((a) => {
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  return ul;
}

function para(document, ...nodes) {
  const p = document.createElement('p');
  p.append(...nodes);
  return p;
}

export function buildNav(document) {
  const root = document.createElement('div');
  const header = document.querySelector('#header, .header');
  if (!header) return root;

  // 1. skip links — the in-page target is the EDS <main> (id set by the header block)
  const skipLabel = header.querySelector('.skip-links__list-label');
  if (skipLabel) root.append(para(document, skipLabel.textContent.trim()));
  const skipLinks = [...header.querySelectorAll('.skip-links__list a')].map((a) => {
    const out = link(document, a);
    if (a.getAttribute('href') === '#page') out.href = '#main';
    return out;
  });
  root.append(listOf(document, skipLinks), document.createElement('hr'));

  // 2. divisions
  root.append(listOf(document, [...header.querySelectorAll('.divisions-nav__link')]
    .map((a) => link(document, a))), document.createElement('hr'));

  // 3. brand
  const logo = header.querySelector('.brand img');
  if (logo) {
    const img = document.createElement('img');
    img.src = logo.getAttribute('src');
    img.alt = logo.getAttribute('alt') || '';
    root.append(para(document, img));
  }
  root.append(document.createElement('hr'));

  // 4. primary nav with doormat sub-lists
  const primary = document.createElement('ul');
  header.querySelectorAll('#primary-nav > .primary-nav__item, .primary-nav > .primary-nav__item')
    .forEach((item) => {
      const top = item.querySelector(':scope > .primary-nav__link');
      if (!top) return;
      const li = document.createElement('li');
      li.append(link(document, top));
      const subs = [...item.querySelectorAll('.doormat-nav__link')].map((a) => link(document, a));
      if (subs.length) li.append(listOf(document, subs));
      primary.append(li);
    });
  root.append(primary, document.createElement('hr'));

  // 5. search: label text + form action
  const form = header.querySelector('.site-tools form, form[role="search"]');
  if (form) {
    const label = form.querySelector('label');
    const a = document.createElement('a');
    a.href = form.getAttribute('action') || '/search';
    a.textContent = label ? label.textContent.trim() : '';
    root.append(para(document, a));
  }
  return root;
}

function buildConfirmation(document, box) {
  const frag = document.createDocumentFragment();
  const heading = box.querySelector('.leaving-confirmation__heading');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.innerHTML = heading.innerHTML;
    frag.append(h2);
  }
  box.querySelectorAll('.leaving-confirmation__copy').forEach((copy) => {
    const p = document.createElement('p');
    p.innerHTML = copy.innerHTML.trim();
    frag.append(p);
  });
  const proceed = box.querySelector('.leaving-confirmation__proceed');
  if (proceed) {
    const strong = document.createElement('strong');
    strong.append(link(document, proceed));
    frag.append(para(document, strong));
  }
  const cancel = box.querySelector('.leaving-confirmation__close');
  if (cancel) {
    const em = document.createElement('em');
    em.append(link(document, cancel));
    frag.append(para(document, em));
  }
  return frag;
}

export function buildFooter(document) {
  const root = document.createElement('div');
  const links = [...document.querySelectorAll('.footer__utility__list .footer__link')]
    .map((a) => link(document, a));
  root.append(listOf(document, links));
  const copyright = document.querySelector('.footer__copyright');
  if (copyright) {
    const text = [...copyright.childNodes]
      .filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    root.append(para(document, text));
  }
  const leaving = document.querySelector('#leaving-confirmation');
  if (leaving) root.append(document.createElement('hr'), buildConfirmation(document, leaving));
  const email = document.querySelector('#leaving-confirmation--email');
  if (email) root.append(document.createElement('hr'), buildConfirmation(document, email));
  return root;
}

