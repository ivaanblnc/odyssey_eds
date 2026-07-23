/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Clear block DOM completely and rebuild
  const rows = [...block.children];
  const imageRow = rows[0];
  const contentRow = rows[1];

  const picture = imageRow?.querySelector('picture');

  block.textContent = '';

  // 1. Background image
  if (picture) {
    picture.classList.add('hero-bg');
    block.append(picture);
  }

  // 2. Gradient overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  block.append(overlay);

  // 3. Content container
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (contentRow) {
    const val = contentRow.querySelector('div:last-child') || contentRow;

    // Eyebrow
    const eyebrow = document.createElement('div');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.innerHTML = '<span class="hero-eyebrow-line"></span><span>Chárters privados · 2026</span>';
    content.append(eyebrow);

    // Title (H1)
    const h1 = val.querySelector('h1');
    if (h1) {
      h1.className = 'hero-title';
      // Basic logic to replace italic if needed, we'll let authors use <em> in AEM rich text
      content.append(h1);
    } else {
      const h1Fallback = document.createElement('h1');
      h1Fallback.className = 'hero-title';
      h1Fallback.innerHTML = 'El mar,<br /><em>sin ruido.</em>';
      content.append(h1Fallback);
    }

    // Description
    const p = val.querySelector('p');
    if (p) {
      p.className = 'hero-description';
      content.append(p);
    }

    // Conditionally render Booking Widget or Stats
    if (block.classList.contains('destination')) {
      const stats = document.createElement('div');
      stats.className = 'hero-stats';

      // Use rows to extract stats dynamically, or default if missing
      const statFields = [
        { label: rows[2]?.textContent?.trim() || 'Embarcaciones', value: rows[3]?.textContent?.trim() || '42' },
        { label: rows[4]?.textContent?.trim() || 'Rutas', value: rows[5]?.textContent?.trim() || '18' },
        { label: rows[6]?.textContent?.trim() || 'Días alta', value: rows[7]?.textContent?.trim() || '07' },
      ];

      statFields.forEach((f) => {
        const statDiv = document.createElement('div');
        statDiv.innerHTML = `
          <div class="hero-stat-value">${f.value}</div>
          <div class="hero-stat-label">${f.label}</div>
        `;
        stats.append(statDiv);
      });
      content.append(stats);
    } else {
      // Booking Widget
      const widget = document.createElement('div');
      widget.className = 'hero-booking-widget';

      const fields = [
        { label: rows[2]?.textContent?.trim() || 'Destino', value: rows[3]?.textContent?.trim() || 'A medida' },
        { label: rows[4]?.textContent?.trim() || 'Embarque', value: rows[5]?.textContent?.trim() || 'Flexible' },
        { label: rows[6]?.textContent?.trim() || 'Regreso', value: rows[7]?.textContent?.trim() || 'Flexible' },
        { label: rows[8]?.textContent?.trim() || 'Huéspedes', value: rows[9]?.textContent?.trim() || 'A convenir' },
      ];

      fields.forEach((f) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'booking-field';
        fieldDiv.innerHTML = `
          <div class="booking-label">${f.label}</div>
          <div class="booking-val">${f.value}</div>
        `;
        widget.append(fieldDiv);
      });

      content.append(widget);

      // Actions
      const actions = document.createElement('div');
      actions.className = 'hero-actions';
      actions.innerHTML = `
        <a href="/flota" class="btn-search">Buscar flota</a>
        <a href="#" class="btn-link">Hablar con un concierge →</a>
      `;
      content.append(actions);
    }
  }

  block.append(content);
}
