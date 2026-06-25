(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal:not(.reveal-now)');

  if (prefersReduce || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  const featureStagger = new WeakMap();
  document.querySelectorAll('.features-grid').forEach((grid) => {
    grid.querySelectorAll('.feature').forEach((el, i) => featureStagger.set(el, i));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const idx = featureStagger.get(el);
      if (idx != null) el.style.setProperty('--reveal-delay', `${idx * 80}ms`);
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((el) => io.observe(el));
})();

/* Mobile can't install a Mac app — route phone visitors to a "send it to your Mac" handoff. */
(() => {
  const isMobile = (() => {
    const ua = navigator.userAgent || '';
    if (/Android|iPhone|iPod/i.test(ua)) return true;
    if (/iPad/i.test(ua)) return true;
    // iPadOS 13+ reports as "Macintosh" but is touch-only — treat as mobile.
    if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return true;
    return false;
  })();

  if (!isMobile) return;

  const badge = document.getElementById('appStoreBadge');
  const handoff = document.getElementById('macHandoff');
  if (!badge || !handoff) return;

  badge.hidden = true;
  handoff.hidden = false;

  const copyBtn = document.getElementById('copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = copyBtn.dataset.url;
      const original = copyBtn.textContent;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        copyBtn.textContent = 'Link copied ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = original;
          copyBtn.classList.remove('copied');
        }, 2200);
      } catch (e) {
        window.prompt('Copy this link to your Mac:', url);
      }
    });
  }
})();
