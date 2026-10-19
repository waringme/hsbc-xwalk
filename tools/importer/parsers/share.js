/* eslint-disable */
/* global WebImporter */

/**
 * Parser: share — the "Share" bar (.share-actions).
 * Source: https://www.about.hsbc.co.uk/news-and-media/100-year-biodiversity-bid-for-south-of-scotland-gets-boost-from-hsbc-uk
 * Model (blocks/share/_share.json): text (richtext) = label paragraph + one list item per
 * network link; the link text is the source's screen-reader label, the href is verbatim.
 */
export default function parse(element, { document }) {
  const labelSource = element.querySelector('.share-actions__label__inner, .share-actions__label');
  const cell = document.createDocumentFragment();
  cell.appendChild(document.createComment(' field:text '));

  const label = document.createElement('p');
  label.textContent = labelSource ? labelSource.textContent.trim() : '';
  if (label.textContent) cell.appendChild(label);

  const list = document.createElement('ul');
  element.querySelectorAll('.share-actions__list a, .share-actions__item a').forEach((source) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = source.getAttribute('href');
    const name = source.querySelector('.a11y');
    a.textContent = (name ? name.textContent : source.textContent).trim();
    li.appendChild(a);
    list.appendChild(li);
  });
  if (list.children.length) cell.appendChild(list);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Share', cells: [[cell]] });
  element.replaceWith(block);
}
