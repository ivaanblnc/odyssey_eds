/**
 * loads and decorates the yacht-title block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Extract matrix rows delivered by AEM
  // Row 0: category + title (col0 = category, col1 = title)
  // Row 1: subtitle + price (col0 = subtitle, col1 = price)
  // Row 2: price label + base (col0 = price label, col1 = base)
  const rows = [...block.children];
  const row0 = rows[0] ? [...rows[0].children] : [];
  const row1 = rows[1] ? [...rows[1].children] : [];
  const row2 = rows[2] ? [...rows[2].children] : [];

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'yacht-title-container';

  // Left column — titles
  const titleCol = document.createElement('div');
  titleCol.className = 'yacht-title-title-col';

  if (row0[0]) {
    row0[0].classList.add('yacht-title-category');
    titleCol.append(row0[0]);
  }

  const h1 = document.createElement('h1');
  h1.className = 'yacht-title-heading';

  if (row0[1]) {
    const titleSpan = document.createElement('span');
    titleSpan.className = 'yacht-title-main-title';
    titleSpan.append(...row0[1].childNodes);
    h1.append(titleSpan);
  }

  h1.append(document.createElement('br'));

  if (row1[0]) {
    const subtitleEm = document.createElement('em');
    subtitleEm.className = 'yacht-title-subtitle';
    subtitleEm.append(...row1[0].childNodes);
    h1.append(subtitleEm);
  }

  titleCol.append(h1);

  // Right column — price
  const priceCol = document.createElement('div');
  priceCol.className = 'yacht-title-price-col';

  if (row2[0]) {
    row2[0].classList.add('yacht-title-price-prefix');
    priceCol.append(row2[0]);
  }

  if (row1[1]) {
    const priceVal = document.createElement('div');
    priceVal.className = 'yacht-title-price-val';
    priceVal.append(...row1[1].childNodes);
    priceCol.append(priceVal);
  }

  if (row2[1]) {
    row2[1].classList.add('yacht-title-base');
    priceCol.append(row2[1]);
  }

  container.append(titleCol, priceCol);
  block.append(container);
}
