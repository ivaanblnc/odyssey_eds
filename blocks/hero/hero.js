/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Clear block DOM completely and rebuild
  const rows = [...block.children];
  // Detect if we have Universal Editor rows (11 rows) or standard rows
  let imageRow;
  let eyebrowRow;
  let contentRow;
  let statStartIndex = -1;

  if (rows.length >= 10) {
    if (rows[3]?.querySelector('h1')) {
      // Universal Editor format with imageAlt field (12 fields)
      imageRow = rows[0];
      eyebrowRow = rows[2];
      contentRow = rows[3];
      statStartIndex = 4;
    } else if (rows[2]?.querySelector('h1')) {
      // Universal Editor format without imageAlt field (11 fields)
      imageRow = rows[0];
      eyebrowRow = rows[1];
      contentRow = rows[2];
      statStartIndex = 3;
    }
  }

  if (statStartIndex === -1) {
    // Standard format
    imageRow = rows[0];
    contentRow = rows[1];
  }

  const picture = imageRow?.querySelector('picture');
  const imageLink = imageRow?.querySelector('a');

  block.textContent = '';

  // 1. Background image
  const textContent = imageRow?.textContent?.trim();
  if (picture) {
    picture.classList.add('hero-bg');
    block.append(picture);
  } else if (imageLink) {
    // Universal Editor provides a link to the image if it's external or not processed
    const img = document.createElement('img');
    img.src = imageLink.href;
    img.alt = imageLink.textContent || '';
    img.className = 'hero-bg';
    block.append(img);
  } else if (textContent && (textContent.endsWith('.jpg') || textContent.endsWith('.png') || textContent.endsWith('.jpeg') || textContent.endsWith('.webp'))) {
    // Universal Editor provides raw string for internal DAM references
    const img = document.createElement('img');
    img.src = textContent;
    img.alt = '';
    img.className = 'hero-bg';
    block.append(img);
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
    const eyebrowText = eyebrowRow ? eyebrowRow.textContent.trim() : 'Chárters privados · 2026';
    if (eyebrowText) {
      const eyebrow = document.createElement('div');
      eyebrow.className = 'hero-eyebrow';
      eyebrow.innerHTML = `<span class="hero-eyebrow-line"></span><span>${eyebrowText}</span>`;
      content.append(eyebrow);
    }

    // Title (H1)
    const h1 = val.querySelector('h1');
    if (h1) {
      h1.className = 'hero-title';
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
        { label: rows[statStartIndex]?.textContent?.trim() || 'Embarcaciones', value: rows[statStartIndex+1]?.textContent?.trim() || '42' },
        { label: rows[statStartIndex+2]?.textContent?.trim() || 'Rutas', value: rows[statStartIndex+3]?.textContent?.trim() || '18' },
        { label: rows[statStartIndex+4]?.textContent?.trim() || 'Días alta', value: rows[statStartIndex+5]?.textContent?.trim() || '07' },
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
        { label: rows[statStartIndex]?.textContent?.trim() || 'Destino', value: rows[statStartIndex+1]?.textContent?.trim() || 'A medida' },
        { label: rows[statStartIndex+2]?.textContent?.trim() || 'Embarque', value: rows[statStartIndex+3]?.textContent?.trim() || 'Flexible' },
        { label: rows[statStartIndex+4]?.textContent?.trim() || 'Regreso', value: rows[statStartIndex+5]?.textContent?.trim() || 'Flexible' },
        { label: rows[statStartIndex+6]?.textContent?.trim() || 'Huéspedes', value: rows[statStartIndex+7]?.textContent?.trim() || 'A convenir' },
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
