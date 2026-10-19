/* stardust:provenance writtenBy=stardust:replica phase=interaction-parity
   Only behaviours observed firing on the live page (stardust/replica/motion/<slug>.json +
   stardust/.work/replica/interact/live-*.json): header search reveal, and the external-link
   "You are leaving" lightbox. Same state classes as the source. */
(() => {
  const html = document.documentElement;
  const { body } = document;

  // Header search: first click reveals the field, a click with a query submits.
  const form = document.querySelector('.search-box');
  const input = form && form.querySelector('input');
  const submit = form && form.querySelector('.search-box__submit');
  if (form && input && submit) {
    const open = (state) => {
      input.classList.toggle('search-box__input--hidden', !state);
      submit.classList.toggle('search-box__submit--disabled', !state);
      form.classList.toggle('search-box--open', state);
      if (state) input.focus();
    };
    open(false);
    submit.addEventListener('click', (e) => {
      if (form.classList.contains('search-box--open') && input.value.trim()) return;
      e.preventDefault();
      open(!form.classList.contains('search-box--open'));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) open(false); });
  }

  // Cinemagraph: autoplay muted loop (observed live) unless reduced motion; toggle pause/play.
  document.querySelectorAll('.cinemagraph').forEach((cg) => {
    const video = cg.querySelector('.cinemagraph__video');
    const toggle = cg.querySelector('.cinemagraph__toggle');
    const icon = toggle && toggle.querySelector('.icon');
    const label = toggle && toggle.querySelector('.a11y');
    if (!video || !toggle) return;
    // UI state follows the media events (as live: classes swap when playback actually starts/stops).
    const paint = (playing) => {
      cg.classList.toggle('cinemagraph--paused', !playing);
      icon.classList.toggle('icon-pause', playing);
      icon.classList.toggle('icon-play', !playing);
      if (label) label.textContent = playing ? 'Pause background video' : 'Play background video';
    };
    video.addEventListener('playing', () => paint(true));
    video.addEventListener('pause', () => paint(false));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && window.matchMedia('(min-width: 780px)').matches) { video.preload = 'auto'; video.play().catch(() => paint(false)); }
    toggle.addEventListener('click', () => { if (video.paused) video.play().catch(() => paint(false)); else video.pause(); });
  });

  // Accordion (observed live: accordion__item--active toggles, 0.2s background transition).
  document.querySelectorAll('.accordion__heading button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion__item');
      const open = !item.classList.contains('accordion__item--active');
      item.classList.toggle('accordion__item--active', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Confirmation lightboxes (observed live): external links in editorial text → #leaving-confirmation;
  // mailto links → #leaving-confirmation--email. Templates stay in the footer until opened.
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<div class="lightbox__inner"><a class="lightbox__close" href="#" title="Close notification" aria-label="Close notification"></a></div>';
  const inner = box.firstElementChild;
  body.append(overlay, box);
  let current = null;
  let opener = null;
  const close = () => {
    if (!current) return;
    box.classList.remove('lightbox--active');
    overlay.classList.remove('lightbox-overlay--active');
    box.setAttribute('aria-hidden', 'true');
    body.classList.remove('lock-scroll');
    html.classList.remove('no-scroll');
    current.home.append(current.template);
    current = null;
    if (opener) opener.focus();
  };
  const show = (template, link) => {
    opener = link;
    current = { template, home: template.parentElement };
    inner.append(template);
    const proceed = template.querySelector('.leaving-confirmation__proceed');
    proceed.href = link.href;
    if (link.protocol !== 'mailto:') { proceed.target = '_blank'; proceed.rel = 'noopener nofollow'; }
    box.style.top = `${window.innerWidth > 640 ? 180 : 0}px`;
    box.classList.add('lightbox--active');
    overlay.classList.add('lightbox-overlay--active');
    box.setAttribute('aria-hidden', 'false');
    body.classList.add('lock-scroll');
    html.classList.add('no-scroll');
    proceed.focus();
  };
  const leaving = document.getElementById('leaving-confirmation');
  const email = document.getElementById('leaving-confirmation--email');
  // Observed live (2026-10-18): every off-site link in the page body and footer opens the leaving
  // confirmation — promos and footer included — except hosts on hsbc.com, which navigate directly.
  // Share buttons and the header were not observed triggering it.
  if (leaving) {
    document.querySelectorAll('#page a[href^="http"], .footer__utility a[href^="http"]').forEach((a) => {
      if (a.hostname === window.location.hostname || /(^|\.)hsbc\.com$/.test(a.hostname)) return;
      if (a.closest('.share-actions, .leaving-confirmation')) return;
      a.addEventListener('click', (e) => { e.preventDefault(); show(leaving, a); });
    });
  }
  if (email) {
    document.querySelectorAll('#page a[href^="mailto:"]').forEach((a) => {
      a.addEventListener('click', (e) => { e.preventDefault(); show(email, a); });
    });
  }
  box.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox__close, .leaving-confirmation__close')) { e.preventDefault(); close(); }
    else if (e.target.closest('.leaving-confirmation__proceed')) close();
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
