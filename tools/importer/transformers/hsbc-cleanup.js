/* eslint-disable */
/* global WebImporter */

/**
 * hsbc-cleanup — strips about.hsbc.co.uk page chrome and CMS artefacts before parsing, and
 * normalises authored markup after parsing.
 *
 * beforeTransform: header, footer, lightbox templates, empty rail columns, scripts and masks.
 * afterTransform: external-link glyphs and "Opens in new window" helper spans (the EDS site
 * renders the glyph itself), source a11y-breaking attributes, whitespace-only emphasis.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.header',
      'footer',
      '.footer',
      '.leaving-confirmation',
      '.lightbox',
      '.lightbox-overlay',
      '.cookie-notification',
      '.page__mask',
      '.nav-tray',
      '#__tealiumGDPRecModal',
      '.cookie-modal',
      'script',
      'noscript',
      'style',
      'link',
      'iframe',
    ]);
    // empty right-rail columns only — a rail with content (landing pages) is kept
    element.querySelectorAll('.layout__secondary').forEach((rail) => {
      if (!rail.textContent.trim() && !rail.querySelector('img, picture, video')) rail.remove();
    });
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, ['.icon--icon-external']);
    element.querySelectorAll('a .a11y').forEach((span) => {
      if (/opens in new window/i.test(span.textContent)) span.remove();
    });
    element.querySelectorAll('a').forEach((a) => {
      ['tabindex', 'aria-hidden', 'target', 'rel', 'class'].forEach((attr) => a.removeAttribute(attr));
    });
    // whitespace-only <strong>/<em> (the CMS leaves <strong><strong> </strong></strong>)
    element.querySelectorAll('strong, em').forEach((node) => {
      if (!node.textContent.trim() && !node.querySelector('img, picture')) node.remove();
    });
    element.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img, picture')) p.remove();
    });
  }
}
