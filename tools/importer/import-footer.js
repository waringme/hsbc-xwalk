/* eslint-disable */
/* global WebImporter */

/** footer import — one output document built by chrome-lib.js (see its header for the contract). */
import { buildFooter } from './chrome-lib.js';

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const element = buildFooter(document);
    return [{ element, path: '/footer', report: { title: 'footer' } }];
  },
};
