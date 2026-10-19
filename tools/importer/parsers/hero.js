/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero — the full-width page banner (.header-area).
 * Source: https://www.about.hsbc.co.uk/news-and-media/100-year-biodiversity-bid-for-south-of-scotland-gets-boost-from-hsbc-uk
 * Block convention: 1 column; row 1 = block name, row 2 = background image (optional),
 * row 3 = title / subheading / CTA (optional — the article banner carries none).
 * Model (blocks/hero/_hero.json): image (+imageAlt, collapsed), text (richtext).
 */
export default function parse(element, { document }) {
  const source = element.querySelector('.header-area__image img, img');

  // row 2: background image
  const imageCell = document.createDocumentFragment();
  if (source) {
    const img = document.createElement('img');
    img.src = source.getAttribute('data-src') || source.getAttribute('src');
    img.alt = source.getAttribute('alt') || '';
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);
  }

  // row 3: title, subheading, call-to-action
  const textCell = document.createDocumentFragment();
  const text = element.querySelector('.header-area__content, .header-area__text');
  if (text && text.textContent.trim()) {
    textCell.appendChild(document.createComment(' field:text '));
    textCell.append(...text.childNodes);
  }

  const cells = [[imageCell], [textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
