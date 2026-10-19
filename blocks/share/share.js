/**
 * share — the source's "Share" bar (.share-actions--offset): a dark label tab and one icon
 * button per network, parked in the right rail above the headline (inline, centred, below 960px).
 *
 * Authoring (xwalk model "share", one rich-text cell):
 *   <p>Share</p>                       — the label
 *   <ul><li><a href="https://twitter.com/intent/tweet">Share link to this page on X</a></li> …
 * Each link's host picks the network (twitter/x, facebook, linkedin); its text is kept as the
 * screen-reader label. The current page URL (and title for LinkedIn) is added to the href.
 */

const X_LOGO = '<svg class="share-svg" aria-hidden="true" viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path></svg>';

const NETWORKS = [
  { name: 'twitter', hosts: /(^|\.)(twitter|x)\.com$/, param: 'url' },
  { name: 'facebook', hosts: /(^|\.)facebook\.com$/, param: 'u' },
  { name: 'linkedin', hosts: /(^|\.)linkedin\.com$/, param: 'url' },
];

export default function decorate(block) {
  const label = block.querySelector('p');
  const list = block.querySelector('ul');

  const labelBox = document.createElement('span');
  labelBox.className = 'share-label';
  const labelInner = document.createElement('span');
  labelInner.className = 'share-label-inner';
  const labelIcon = document.createElement('i');
  labelIcon.className = 'share-icon';
  labelIcon.setAttribute('aria-hidden', 'true');
  labelInner.append(labelIcon);
  if (label) labelInner.append(label);
  labelBox.append(labelInner);

  if (list) {
    list.classList.add('share-list');
    [...list.children].forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      if (a.parentElement !== li) li.replaceChildren(a);
      const net = NETWORKS.find((n) => n.hosts.test(a.hostname));
      if (net) {
        li.classList.add('share-item', `share-item-${net.name}`);
        const url = new URL(a.href);
        url.searchParams.set(net.param, window.location.href);
        if (net.name === 'linkedin') {
          url.searchParams.set('mini', 'true');
          url.searchParams.set('title', document.title);
        }
        a.href = url.href;
      }
      a.className = '';
      a.removeAttribute('title');
      const text = document.createElement('span');
      text.className = 'a11y';
      text.append(...a.childNodes);
      if (net && net.name === 'twitter') a.insertAdjacentHTML('afterbegin', X_LOGO);
      else {
        const icon = document.createElement('i');
        icon.className = 'share-icon';
        icon.setAttribute('aria-hidden', 'true');
        a.append(icon);
      }
      a.append(text);
    });
  }
  block.replaceChildren(labelBox, ...(list ? [list] : []));
}
