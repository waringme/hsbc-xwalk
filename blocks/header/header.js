import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — the about.hsbc.co.uk chrome (fixed header: skip links, black divisions bar with
 * the search reveal, white primary bar with logo + primary nav; nav tray below 960px).
 *
 * Template-slotted from the /nav document, one section per slot, in this order:
 *   1. skip links: a label paragraph + a list of in-page links (e.g. "Main content" → #main)
 *   2. divisions: a list of links (Personal, Business)
 *   3. brand: the logo image (links to the site root)
 *   4. primary nav: a list of links; a nested list under an item is its (hidden) doormat
 *   5. search: one link — its text is the field label, its path the form action
 * Authored elements are moved into the template, never rebuilt.
 */

const isDesktop = window.matchMedia('(min-width: 960px)');

/** the local preview mounts imported content under /content/; production serves it at / */
function localRoot() {
  return window.location.pathname.startsWith('/content/') ? '/content' : '';
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** the pipeline wraps list-item links in a <p> on live (#98): unwrap */
function unwrapListLinks(list) {
  list.querySelectorAll(':scope > li > p').forEach((p) => {
    if (p.querySelector('a')) p.replaceWith(...p.childNodes);
  });
}

/** strip buttonization a fragment's decorateButtons() may have applied */
function unbutton(root) {
  root.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    const p = a.closest('.button-wrapper');
    if (p) p.classList.remove('button-wrapper');
  });
}

function slot(section) {
  return section ? section.querySelector('.default-content-wrapper') || section : null;
}

function buildSearch(link) {
  const form = el('form', 'search-box', { role: 'search', action: link ? link.pathname : '/search' });
  const fields = el('div', 'search-box-fields');
  const label = el('label', 'a11y', { for: 'search-header' });
  if (link) label.append(...link.childNodes);
  const input = el('input', 'search-box-input search-box-input-hidden', {
    id: 'search-header', name: 'query', type: 'text',
  });
  const submit = el('button', 'search-box-submit', { type: 'submit', 'aria-label': label.textContent });
  submit.append(el('i', 'search-icon', { 'aria-hidden': 'true' }));
  fields.append(label, input, submit);
  form.append(fields);

  // first click reveals the field, a click with a query submits (observed live)
  const open = (state) => {
    input.classList.toggle('search-box-input-hidden', !state);
    form.classList.toggle('search-box-open', state);
    if (state) input.focus();
  };
  submit.addEventListener('click', (e) => {
    if (form.classList.contains('search-box-open') && input.value.trim()) return;
    e.preventDefault();
    open(!form.classList.contains('search-box-open'));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) open(false); });
  return form;
}

function markCurrent(list) {
  const here = window.location.pathname.slice(localRoot().length);
  list.querySelectorAll(':scope > li').forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (!a) return;
    if (li.querySelector('ul')) li.classList.add('has-doormat');
    const path = new URL(a.href, window.location).pathname.replace(/\/$/, '');
    if (path && (here === path || here.startsWith(`${path}/`))) li.classList.add('current');
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : `${localRoot()}/nav`;
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  unbutton(fragment);
  const [skip, divisions, brand, primary, search] = [...fragment.children].map(slot);

  // 1. skip links (hidden above the header until focused)
  const skipLinks = el('div', 'skip-links');
  const skipInner = el('div', 'skip-links-inner');
  if (skip) {
    const label = skip.querySelector('p');
    const list = skip.querySelector('ul');
    if (label) skipInner.append(label);
    if (list) {
      unwrapListLinks(list);
      skipInner.append(list);
    }
  }
  skipLinks.append(skipInner);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  // 2. secondary bar: divisions + search
  const secondary = el('div', 'header-secondary');
  const secondaryInner = el('div', 'header-container');
  const divisionsNav = el('div', 'divisions-nav');
  const divisionsList = divisions && divisions.querySelector('ul');
  if (divisionsList) {
    unwrapListLinks(divisionsList);
    divisionsList.querySelectorAll('a').forEach((a) => {
      const wrap = el('span', 'divisions-nav-link-wrap');
      wrap.append(...a.childNodes);
      a.append(wrap);
    });
    divisionsNav.append(divisionsList);
  }
  const tools = el('div', 'site-tools');
  tools.append(buildSearch(search && search.querySelector('a')));
  secondaryInner.append(divisionsNav, tools);
  secondary.append(secondaryInner);

  // 3 + 4. primary bar: tray toggle, brand, primary nav
  const primaryBar = el('div', 'header-primary');
  const nav = el('nav', 'header-container', { 'aria-label': 'Primary', 'aria-expanded': 'false' });
  const toggle = el('button', 'nav-tray-toggle', {
    type: 'button', 'aria-controls': 'primary-nav', 'aria-label': 'Menu',
  });
  toggle.append(el('i', 'menu-icon', { 'aria-hidden': 'true' }));
  const brandBox = el('div', 'brand');
  const logoLink = el('a', 'brand-logo', { href: '/' });
  const logo = brand && brand.querySelector('picture, img');
  if (logo) logoLink.append(logo);
  brandBox.append(logoLink);
  const primaryNav = el('div', 'primary-nav', { id: 'primary-nav' });
  const primaryList = primary && primary.querySelector('ul');
  if (primaryList) {
    unwrapListLinks(primaryList);
    markCurrent(primaryList);
    primaryNav.append(primaryList);
  }
  nav.append(toggle, brandBox, primaryNav);
  primaryBar.append(nav);

  toggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  isDesktop.addEventListener('change', () => nav.setAttribute('aria-expanded', 'false'));

  block.replaceChildren(skipLinks, secondary, primaryBar);
}
