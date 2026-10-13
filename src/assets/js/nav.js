// Mobile navigation toggle
const navToggle = document.getElementById('mobile-nav-toggle');
const navMenu = document.getElementById('mobile-nav-menu');

function toggleMenu() {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.setAttribute('aria-hidden', isExpanded);
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
}

navToggle.addEventListener('click', toggleMenu);
