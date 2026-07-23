import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getAuthToken, getClientProfile } from '../../scripts/api.js';

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // The boilerplate `/nav` usually returns a default content wrapper with ul > li.
  // We'll extract the links from it. If it doesn't exist, we fallback to hardcoded (for demo).
  const navLinks = [];
  if (fragment) {
    const ul = fragment.querySelector('ul');
    if (ul) {
      ul.querySelectorAll(':scope > li > a').forEach((a) => {
        navLinks.push({ label: a.textContent, url: a.href });
      });
    }
  }

  // Fallback to Lovable structure if AEM nav isn't setup yet
  if (navLinks.length === 0) {
    navLinks.push(
      { label: 'Inicio', url: '/' },
      { label: 'Destinos', url: '/destinos' },
      { label: 'Flota', url: '/flota' },
      { label: 'Experiencias', url: '/experiencias' },
      { label: 'Concierge', url: '/concierge' },
      { label: 'Diario', url: '/diario' },
    );
  }

  // Clear boilerplate DOM
  block.textContent = '';

  // 1. Create Wrapper
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // Create Main Nav
  const nav = document.createElement('nav');

  // Left: Brand
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  navBrand.innerHTML = `
    <a href="/">
      <span class="brand-title">Odyssey</span>
      <span class="brand-subtitle">Est. MMXXVI</span>
    </a>
  `;

  // Middle: Sections (Desktop)
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  const ul = document.createElement('ul');
  navLinks.forEach((link, idx) => {
    // Only show top 5 in desktop
    if (idx >= 5) return;
    const li = document.createElement('li');
    li.innerHTML = `<a href="${link.url}">${link.label}</a>`;
    ul.append(li);
  });
  navSections.append(ul);

  // Right: Tools
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  navTools.innerHTML = `
    <span style="opacity: 0.8" class="hide-mobile">EN · ES · EL</span>
    <a href="/login" class="hide-mobile auth-link-desktop" style="border-bottom: 1px solid var(--gold); padding-bottom: 4px; color: var(--gold); cursor: pointer; text-decoration: none;">Acceder</a>
  `;

  // Hamburger (Mobile)
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `
    <button type="button" aria-controls="mobile-nav" aria-label="Abrir índice">
      <span class="nav-hamburger-icon">Índice</span>
      <span class="nav-hamburger-plus">+</span>
    </button>
  `;
  navTools.append(hamburger);

  nav.append(navBrand, navSections, navTools);
  navWrapper.append(nav);
  block.append(navWrapper);

  // 2. Create Mobile Overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.innerHTML = `
    <div class="overlay-header">
      <span class="brand">Odyssey</span>
      <button aria-label="Cerrar">
        <span class="btn-text">Cerrar</span>
        <span class="btn-x">×</span>
      </button>
    </div>
    <div class="overlay-nav">
      ${navLinks.map((link, idx) => `
        <a href="${link.url}">
          <span class="nav-label">${link.label}</span>
          <span class="nav-num">0${idx + 1}</span>
        </a>
      `).join('')}
    </div>
    <div class="overlay-footer">
      <div class="footer-left">
        <div class="auth"><a href="/login" style="color:inherit;text-decoration:none;">Acceder</a></div>
        <div class="lang">EN · ES · EL</div>
      </div>
      <div class="footer-right">
        Gouvia Marina<br />Corfú, GR
      </div>
    </div>
  `;

  block.append(overlay);

  // 3. Interactions
  const openBtn = hamburger.querySelector('button');
  const closeBtn = overlay.querySelector('.overlay-header button');
  const overlayLinks = overlay.querySelectorAll('.overlay-nav a');

  const openMenu = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlayLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // 4. Scroll transition for solid state (optional, if we want it to become solid on scroll)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navWrapper.classList.add('solid');
    } else {
      navWrapper.classList.remove('solid');
    }
  });

  // Check if we are on a page that should be solid by default
  // (not home page) or in Universal Editor
  if ((window.location.pathname !== '/' && window.location.pathname !== '/content/odyssey-eds/index') || window.location.hostname.includes('author')) {
    navWrapper.classList.add('solid');
  }

  // 5. Hydrate Session State
  if (getAuthToken()) {
    getClientProfile().then((profile) => {
      if (profile && profile.data && profile.data.user) {
        const { user } = profile.data;
        const name = user.name.split(' ')[0];

        const authDesktop = navTools.querySelector('.auth-link-desktop');
        if (authDesktop) {
          authDesktop.textContent = `Hola, ${name}`;
          authDesktop.href = '/profile';
        }

        const authMobile = overlay.querySelector('.auth');
        if (authMobile) {
          authMobile.innerHTML = `<a href="/profile" style="color:inherit;text-decoration:none;">Hola, ${name}</a>`;
        }
      }
    }).catch(() => {
      // Ignore errors (user might have invalid token, we'll let other pages handle forceful logout)
    });
  }
}
