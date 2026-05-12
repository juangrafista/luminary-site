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
