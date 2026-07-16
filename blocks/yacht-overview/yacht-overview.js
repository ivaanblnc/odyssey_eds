import { getAuthToken, confirmBooking } from '../../scripts/api.js';

export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const titleText = rows[1]?.textContent?.trim() || '';
  const descHtml = rows[2]?.querySelector('div')?.innerHTML || '';
  const tagsText = rows[3]?.textContent?.trim() || '';
  const alertText = rows[4]?.textContent?.trim() || '';
  const bookingHtml = rows[5]?.querySelector('div')?.innerHTML || '';

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'yacht-overview-grid';

  // Left Column
  const left = document.createElement('div');
  left.className = 'yacht-overview-left';

  if (eyebrowText) {
    left.innerHTML += `<div class="yacht-overview-eyebrow">${eyebrowText}</div>`;
  }
  if (titleText) {
    left.innerHTML += `<h2 class="yacht-overview-title">${titleText}</h2>`;
  }
  if (descHtml) {
    left.innerHTML += `<div class="yacht-overview-desc">${descHtml}</div>`;
  }

  if (tagsText) {
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'yacht-overview-tags';
    const tagsArray = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    tagsArray.forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'yacht-tag';
      tag.textContent = t;
      tagsContainer.append(tag);
    });
    left.append(tagsContainer);
  }

  // Right Column
  const right = document.createElement('aside');
  right.className = 'yacht-overview-right';

  if (alertText) {
    const alertBox = document.createElement('div');
    alertBox.className = 'yacht-alert-box';
    alertBox.innerHTML = `
      <div class="yacht-alert-header">
        <span class="yacht-alert-dot"></span> Alerta de inventario
      </div>
      <p class="yacht-alert-text">\${alertText}</p>
    `;
    right.append(alertBox);
  }

  if (bookingHtml) {
    const bookingBox = document.createElement('div');
    bookingBox.className = 'yacht-booking-box';
    bookingBox.innerHTML = bookingHtml;

    // Apply specific classes to elements inside bookingHtml

    // The first heading is the title
    const headings = bookingBox.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      headings[0].className = 'yacht-booking-title';
    }

    // Process tables
    const tables = bookingBox.querySelectorAll('table');
    tables.forEach((table, idx) => {
      if (idx === 0) {
        // First table: dates/details
        table.className = 'yacht-booking-dates';
      } else if (idx === 1) {
        // Second table: price breakdown
        table.className = 'yacht-booking-breakdown';
      }
    });

    // Style the Total
    const strongs = bookingBox.querySelectorAll('strong');
    strongs.forEach((s) => {
      if (s.textContent.includes('Total') || s.textContent.includes('€')) {
        s.classList.add('yacht-booking-total');
      }
    });

    // Style links as buttons and intercept
    const links = bookingBox.querySelectorAll('a');
    links.forEach((link, idx) => {
      if (idx === 0) {
        link.className = 'yacht-btn-primary';

        // Hydrate with backend integration
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          if (!getAuthToken()) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
          }

          link.textContent = 'Procesando...';
          link.style.pointerEvents = 'none';

          try {
            const yachtName = document.querySelector('h1')?.textContent || 'Yacht';
            await confirmBooking({ yacht: yachtName, dates: 'TBD' });
            link.textContent = '¡Reserva Confirmada!';
            link.style.backgroundColor = 'var(--success, #28a745)';
            setTimeout(() => {
              window.location.href = '/profile/mis-reservas';
            }, 1500);
          } catch (error) {
            link.textContent = 'Error. Reintentar';
            link.style.pointerEvents = 'auto';
          }
        });
      } else {
        link.className = 'yacht-btn-link';
      }
    });

    right.append(bookingBox);
  }

  container.append(left);
  container.append(right);
  block.append(container);
}
