/* eslint-disable */
/* global WebImporter */

/**
 * hsbc-sections — splits the page into the template's sections (payload.template.sections).
 *
 * beforeTransform: tags each section's boundary element (first matching selector) while the
 * source classes are still present (parsers replace some of them with block tables).
 * afterTransform: inserts a section break before every tagged section after the first, and a
 * Section Metadata block (style) at the end of every styled section.
 */
const ATTR = 'data-import-section';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];
  if (!sections.length) return;
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    sections.forEach((section) => {
      const selectors = section.selector || [];
      for (let i = 0; i < selectors.length; i += 1) {
        let found = null;
        try { found = element.querySelector(selectors[i]); } catch (e) { found = null; }
        if (found && !found.hasAttribute(ATTR)) {
          found.setAttribute(ATTR, section.id);
          break;
        }
      }
    });
  }

  if (hookName === 'afterTransform') {
    const tagged = [...element.querySelectorAll(`[${ATTR}]`)];
    tagged.forEach((node, index) => {
      const section = sections.find((s) => s.id === node.getAttribute(ATTR));
      node.removeAttribute(ATTR);
      if (index > 0) node.before(document.createElement('hr'));
      if (section && section.style) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        node.append(meta);
      }
    });
  }
}
