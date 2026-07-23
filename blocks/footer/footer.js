/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Clear boilerplate DOM
  block.textContent = '';

  const footerHtml = `
    <div class="footer-container">
      <div class="footer-brand">
        <div class="brand-title">Odyssey</div>
        <div class="brand-subtitle">Curated charters · Est. MMXXVI</div>
        <p>
          Chárters privados operados desde Gouvia Marina, Corfú.<br />
          Concierge náutico en Atenas, Mónaco y Palma.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navegar</div>
        <ul>
          <li>Destinos</li>
          <li>Flota</li>
          <li>Experiencias</li>
          <li>Diario de a bordo</li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Contacto</div>
        <ul>
          <li>Gouvia Marina</li>
          <li>49100 Kontokali</li>
          <li>Kerkyra, GR</li>
          <li class="gold">concierge@odyssey.gr</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-container">
        <span>© MMXXVI Odyssey Charters</span>
        <span>Privacidad · Términos · Cookies</span>
      </div>
    </div>
  `;

  block.innerHTML = footerHtml;
}
