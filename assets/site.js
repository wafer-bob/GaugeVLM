/* GaugeVLM project page: local, dependency-free interactions. */
(() => {
  'use strict';
  const figures = {
    teaser: { title: 'GaugeVLM — Research overview', caption: 'Measured geometric errors and consistent spatial truths across views.' },
    pipeline: { title: 'GaugeDPO — Method', caption: 'Measured preference margins, direct supervision across views, and intervention profiles.' },
    bench: { title: 'Gauge-50K & Constancy-Bench', caption: 'One construction across training and evaluation: measured pairs, object interventions, and camera groups.' },
    margin_h: { title: 'Geometric error & policy separation', caption: 'Scene-bootstrap 95% confidence intervals. Measured margins link geometric error to the learned policy gap.' },
    expr_result: { title: 'Predicted versus true measurements', caption: 'MSMU measurements shown in the original paper. Unparseable outputs are excluded.' }
  };
  const dialog = document.querySelector('#figure-dialog');
  let figureOpener;
  document.querySelectorAll('[data-figure]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.figure;
      const figure = figures[key];
      if (!figure) return;
      figureOpener = button;
      document.querySelector('#figure-dialog-title').textContent = figure.title;
      document.querySelector('#figure-dialog-caption').textContent = figure.caption;
      const img = document.querySelector('#figure-dialog-image');
      img.src = `assets/images/${key}.webp`;
      img.alt = button.querySelector('img').alt;
      document.querySelector('#figure-dialog-pdf').href = `assets/figures/${key}.pdf`;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    figureOpener?.focus({ preventScroll: true });
  });

  const copyButton = document.querySelector('#copy-citation');
  const copyStatus = document.querySelector('#copy-status');
  copyButton.addEventListener('click', async () => {
    const text = document.querySelector('#bibtex').textContent.trim() + '\n';
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_) { /* Local-file and permission fallback below. */ }
    if (!copied) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(area);
      area.select();
      try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      area.remove();
      copyButton.focus({ preventScroll: true });
    }
    copyStatus.textContent = copied ? 'Citation copied to clipboard.' : 'Please select the citation text to copy, or use Download.';
    copyButton.innerHTML = copied ? 'Copied <span aria-hidden="true">✓</span>' : 'Copy citation <span aria-hidden="true">⧉</span>';
  });

  const links = [...document.querySelectorAll('.nav-shell nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
  }
})();
