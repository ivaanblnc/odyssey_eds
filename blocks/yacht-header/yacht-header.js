export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const titleHtml = rows[1]?.querySelector('div')?.innerHTML || '';
  const priceLabelText = rows[2]?.textContent?.trim() || '';
  const priceText = rows[3]?.textContent?.trim() || '';
  const locationText = rows[4]?.textContent?.trim() || '';

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'yacht-header-container';

  const left = document.createElement('div');
  left.className = 'yacht-header-left';
  left.innerHTML = `
    <div class="yacht-header-eyebrow">${eyebrowText}</div>
    <h1 class="yacht-header-title">${titleHtml}</h1>
  `;

  const right = document.createElement('div');
  right.className = 'yacht-header-right';
  right.innerHTML = `
    <div class="yacht-header-price-label">${priceLabelText}</div>
    <div class="yacht-header-price">${priceText}</div>
    <div class="yacht-header-location">${locationText}</div>
  `;

  container.append(left);
  container.append(right);
  block.append(container);
}
