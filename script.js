const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item, index) => {
    item.classList.add('is-pending');
    item.style.transitionDelay = `${Math.min((index % 3) * 85, 170)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

const photoBridge = document.querySelector('.photo-bridge');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (photoBridge) {
  const photos = photoBridge.querySelectorAll('[data-drift]');
  let animationFrame = null;
  const updatePhotoBridge = () => {
    animationFrame = null;
    if (reducedMotion.matches) {
      photos.forEach((photo) => photo.style.removeProperty('--drift'));
      return;
    }
    const bounds = photoBridge.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (bounds.bottom < 0 || bounds.top > viewportHeight) return;
    const progress = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));
    photos.forEach((photo) => {
      const offset = (progress - .5) * 2 * Number(photo.dataset.drift);
      photo.style.setProperty('--drift', `${offset.toFixed(1)}px`);
    });
  };
  const requestPhotoUpdate = () => {
    if (animationFrame === null) animationFrame = window.requestAnimationFrame(updatePhotoBridge);
  };
  window.addEventListener('scroll', requestPhotoUpdate, { passive: true });
  window.addEventListener('resize', requestPhotoUpdate);
  reducedMotion.addEventListener('change', requestPhotoUpdate);
  requestPhotoUpdate();
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const topbar = document.querySelector('.topbar');
const mobileLayout = window.matchMedia('(max-width: 760px)');

if (menuToggle && mainNav && topbar) {
  topbar.classList.add('has-menu');

  const setMenuOpen = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    topbar.classList.toggle('is-menu-open', open);
    mainNav.hidden = mobileLayout.matches && !open;
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!topbar.contains(event.target)) setMenuOpen(false);
  });

  mobileLayout.addEventListener('change', () => setMenuOpen(false));
  setMenuOpen(false);
}
