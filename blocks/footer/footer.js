import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — black utility bar (links + copyright) and the site's confirmation lightboxes.
 *
 * Template-slotted from the /footer document, one section per slot, in this order:
 *   1. utility: a list of links + the copyright paragraph
 *   2. leaving confirmation: heading, copy paragraphs, then the proceed CTA (<strong> link)
 *      and the cancel CTA (<em> link) — shown before any off-site link is followed
 *   3. (optional) e-mail confirmation: same shape — shown before a mailto: link is followed
 * Observed live (2026-10-18): every off-site link in the page body and the footer opens the
 * leaving confirmation except hosts on hsbc.com; mailto: links open the e-mail one.
 */

const SOURCE_HOSTS = ['www.about.hsbc.co.uk', 'about.hsbc.co.uk'];

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

function slot(section) {
  return section ? section.querySelector('.default-content-wrapper') || section : null;
}

/** builds a confirmation template from its authored section; nodes are moved, not copied */
function buildConfirmation(content, id) {
  const box = el('div', 'leaving-confirmation', { id });
  const links = el('div', 'leaving-confirmation-links');
  [...content.children].forEach((node) => {
    const a = node.querySelector('a');
    if (node.tagName === 'P' && a && node.textContent.trim() === a.textContent.trim()) {
      const primary = a.classList.contains('primary') || a.closest('strong');
      node.classList.add(primary ? 'leaving-confirmation-proceed' : 'leaving-confirmation-close');
      a.classList.add('button');
      if (primary) links.prepend(node); else links.append(node);
    } else {
      box.append(node);
    }
  });
  box.append(links);
  return box;
}

function isOffSite(a) {
  if (!/^https?:$/.test(a.protocol)) return false;
  const host = a.hostname;
  if (host === window.location.hostname || SOURCE_HOSTS.includes(host)) return false;
  return !/(^|\.)hsbc\.com$/.test(host);
}

function initLightbox(leaving, email) {
  const html = document.documentElement;
  const overlay = el('div', 'lightbox-overlay');
  const box = el('div', 'lightbox', { role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true' });
  const inner = el('div', 'lightbox-inner');
  const closeLink = el('a', 'lightbox-close', { href: '#', 'aria-label': 'Close notification' });
  inner.append(closeLink);
  box.append(inner);
  document.body.append(overlay, box);

  let current = null;
  let opener = null;
  const close = () => {
    if (!current) return;
    box.classList.remove('lightbox-active');
    overlay.classList.remove('lightbox-overlay-active');
    box.setAttribute('aria-hidden', 'true');
    html.classList.remove('no-scroll');
    current.home.append(current.template);
    current = null;
    if (opener) opener.focus();
  };
  const show = (template, link) => {
    opener = link;
    current = { template, home: template.parentElement };
    inner.append(template);
    const proceed = template.querySelector('.leaving-confirmation-proceed a');
    if (proceed) {
      proceed.href = link.href;
      if (link.protocol !== 'mailto:') {
        proceed.target = '_blank';
        proceed.rel = 'noopener nofollow';
      }
    }
    box.style.top = `${window.innerWidth > 640 ? 180 : 0}px`;
    box.classList.add('lightbox-active');
    overlay.classList.add('lightbox-overlay-active');
    box.setAttribute('aria-hidden', 'false');
    html.classList.add('no-scroll');
    if (proceed) proceed.focus();
  };

  document.querySelectorAll('main a[href], footer .footer-utility a[href]').forEach((a) => {
    if (a.closest('.share, .leaving-confirmation')) return;
    let template = null;
    if (a.protocol === 'mailto:') template = email;
    else if (isOffSite(a)) template = leaving;
    if (!template) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      show(template, a);
    });
  });
  box.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox-close, .leaving-confirmation-close')) {
      e.preventDefault();
      close();
    } else if (e.target.closest('.leaving-confirmation-proceed')) close();
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${localRoot()}/footer`;
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const [utility, leavingContent, emailContent] = [...fragment.children].map(slot);

  const bar = el('div', 'footer-utility');
  const inner = el('div', 'footer-inner');
  const nav = el('nav', '', { 'aria-label': 'Footer' });
  const list = utility && utility.querySelector('ul');
  if (list) {
    list.querySelectorAll(':scope > li > p').forEach((p) => p.replaceWith(...p.childNodes));
    nav.append(list);
  }
  const copyright = el('div', 'footer-copyright');
  const copy = utility && utility.querySelector('p');
  if (copy) copyright.append(copy);
  inner.append(nav, copyright);
  bar.append(inner);

  const leaving = leavingContent ? buildConfirmation(leavingContent, 'leaving-confirmation') : null;
  const email = emailContent
    ? buildConfirmation(emailContent, 'leaving-confirmation-email') : null;
  block.replaceChildren(bar, ...[leaving, email].filter(Boolean));
  if (leaving || email) initLightbox(leaving, email);
}
