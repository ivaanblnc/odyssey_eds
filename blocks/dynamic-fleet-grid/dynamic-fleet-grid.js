import { getFleet } from '../../scripts/api.js';

/**
 * Creates a skeleton card element
 * @returns {Element} The skeleton DOM element
 */
function createSkeleton() {
  const card = document.createElement('div');
  card.className = 'dynamic-fleet-grid-card dynamic-fleet-grid-card-skeleton';

  card.innerHTML = `
    <div class="dynamic-fleet-grid-card-image-wrap pulse"></div>
    <div class="dynamic-fleet-grid-card-content">
      <div class="dynamic-fleet-grid-card-meta pulse"></div>
      <div class="dynamic-fleet-grid-card-title pulse"></div>
      <div class="dynamic-fleet-grid-card-specs">
        <div class="pulse"></div>
        <div class="pulse"></div>
      </div>
      <div class="dynamic-fleet-grid-card-footer">
        <div class="pulse"></div>
      </div>
    </div>
  `;
  return card;
}

/**
 * Creates a real yacht card element
 * @param {Object} yacht The yacht data object
 * @returns {Element} The card DOM element
 */
function createYachtCard(yacht) {
  const card = document.createElement('div');
  card.className = 'dynamic-fleet-grid-card';

  const availabilityBadge = yacht.availability === 'Low'
    ? '<span class="dynamic-fleet-grid-card-badge alert">¡Último disponible!</span>'
    : '';

  card.innerHTML = `
    <div class="dynamic-fleet-grid-card-image-wrap">
      ${availabilityBadge}
      <img src="${yacht.image}" alt="${yacht.name}" loading="lazy" class="dynamic-fleet-grid-card-img">
    </div>
    <div class="dynamic-fleet-grid-card-content">
      <div class="dynamic-fleet-grid-card-meta">${yacht.type}</div>
      <h3 class="dynamic-fleet-grid-card-title">${yacht.name}</h3>
      <div class="dynamic-fleet-grid-card-specs">
        <span><img src="/icons/ruler.svg" alt="Length" width="16" height="16"> ${yacht.length}</span>
        <span><img src="/icons/users.svg" alt="Guests" width="16" height="16"> ${yacht.passengers} pax</span>
      </div>
      <div class="dynamic-fleet-grid-card-footer">
        <div class="dynamic-fleet-grid-card-price">
          <span class="currency">€</span>${yacht.pricePerDay.toLocaleString()} <span class="period">/ día</span>
        </div>
        <a href="#book-${yacht.id}" class="dynamic-fleet-grid-card-btn">Ver Detalle</a>
      </div>
    </div>
  `;
  return card;
}

/**
 * loads and decorates the dynamic fleet grid block
 * @param {Element} block The dynamic-fleet-grid block element
 */
export default async function decorate(block) {
  // Read authored data (max 4 cells)
  const rows = [...block.children];
  const getValue = (row) => row?.querySelector('div:last-child')?.textContent?.trim() || '';

  const title = getValue(rows[0]) || 'Explora nuestra flota';
  const region = getValue(rows[1]) || 'mediterraneo';
  const maxItemsStr = getValue(rows[2]) || '4';
  const maxItems = parseInt(maxItemsStr, 10) || 4;
  const noResultsText = getValue(rows[3]) || 'No hay embarcaciones disponibles.';

  // Clear original authored content
  block.textContent = '';

  // Container
  const container = document.createElement('div');
  container.className = 'dynamic-fleet-grid-container';

  // Header
  const header = document.createElement('div');
  header.className = 'dynamic-fleet-grid-header';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  header.append(h2);
  container.append(header);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'dynamic-fleet-grid-layout';
  container.append(grid);

  // Render skeletons first
  for (let i = 0; i < maxItems; i += 1) {
    grid.append(createSkeleton());
  }

  block.append(container);

  // Fetch data asynchronusly
  try {
    const response = await getFleet(region);

    // Clear skeletons
    grid.innerHTML = '';

    if (response && response.length > 0) {
      const boats = response.slice(0, maxItems);
      boats.forEach((boat) => {
        grid.append(createYachtCard(boat));
      });
    } else {
      grid.innerHTML = `<div class="dynamic-fleet-grid-empty">${noResultsText}</div>`;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching fleet:', error);
    grid.innerHTML = '<div class="dynamic-fleet-grid-empty error">No se pudo cargar la flota. Inténtalo más tarde.</div>';
  }
}
