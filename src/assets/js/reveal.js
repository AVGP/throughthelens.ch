// Fallback for browsers that don't support scroll-driven animations (e.g., Firefox)
if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
  const header = document.getElementById('site-header');
  const initialHeight = 100;
  const finalHeight = 70;
  const scrollDistance = 120;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollPercent = Math.min(1, scrollY / scrollDistance);
    const newHeight = initialHeight - (initialHeight - finalHeight) * scrollPercent;

    // Update header height
    header.style.height = `${newHeight}px`;

    // Add a class when scrolled to handle background transitions
    if (scrollY > 50) {
      header.classList.add('scrolled-fallback');
    } else {
      header.classList.remove('scrolled-fallback');
    }
  });
}

// Fallback for entry scroll reveal animations (Intersection Observer)
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed to avoid repetitive animations
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.15 });

  // Target elements that should fade/slide in
  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}
