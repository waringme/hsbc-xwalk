/* eslint-disable */
/* global WebImporter */

/** nav import — one output document built by chrome-lib.js (see its header for the contract). */
import { buildNav } from './chrome-lib.js';

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const element = buildNav(document);
    WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    return [{ element, path: '/nav', report: { title: 'nav' } }];
  },
};
