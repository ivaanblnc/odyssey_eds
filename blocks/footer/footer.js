import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { subscribeNewsletter } from '../../scripts/api.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Add Newsletter logic
  const emailInput = footer.querySelector('input[type="email"], input[name="email"]');
  const subscribeBtn = emailInput?.parentElement?.querySelector('button, a.button');

  if (emailInput && subscribeBtn) {
    subscribeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        // eslint-disable-next-line no-alert
        alert('Por favor, introduce un email válido.');
        return;
      }

      const originalText = subscribeBtn.textContent;
      subscribeBtn.textContent = 'Enviando...';
      subscribeBtn.style.pointerEvents = 'none';

      try {
        await subscribeNewsletter(email);
        emailInput.value = '';
        subscribeBtn.textContent = '¡Suscrito!';
        setTimeout(() => {
          subscribeBtn.textContent = originalText;
          subscribeBtn.style.pointerEvents = 'auto';
        }, 3000);
      } catch (err) {
        subscribeBtn.textContent = 'Error';
        setTimeout(() => {
          subscribeBtn.textContent = originalText;
          subscribeBtn.style.pointerEvents = 'auto';
        }, 3000);
      }
    });
  }

  block.append(footer);
}
