/**
 * loads and decorates the yacht-extras block
 * @param {Element} block The yacht-extras block element
 */
export default function decorate(block) {
  // Row 0: eyebrow
  // Row 1: heading (richtext)
  // Row 2: description (richtext)
  // Rows 3+: Service items (Col 0: name, Col 1: price)
  const rows = [...block.children];
  const eyebrowRow = rows[0];
  const headingRow = rows[1];
  const descRow = rows[2];
  const serviceRows = rows.slice(3);

  const getValue = (row) => {
    if (!row) return null;
    return row.querySelector('div:last-child') || row;
  };

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'yacht-extras-grid';

  // Left column — intro
  const introCol = document.createElement('div');
  introCol.className = 'yacht-extras-intro';

  const eyebrowVal = getValue(eyebrowRow);
  if (eyebrowVal) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'yacht-extras-eyebrow';
    eyebrow.append(...eyebrowVal.childNodes);
    introCol.append(eyebrow);
  }

  const headingVal = getValue(headingRow);
  if (headingVal) {
    const h2 = document.createElement('h2');
    h2.className = 'yacht-extras-heading';
    h2.append(...headingVal.childNodes);
    introCol.append(h2);
  }

  const descVal = getValue(descRow);
  if (descVal) {
    const p = document.createElement('p');
    p.className = 'yacht-extras-desc';
    p.append(...descVal.childNodes);
    introCol.append(p);
  }

  container.append(introCol);

  // Right column — services list
  const listCol = document.createElement('div');
  listCol.className = 'yacht-extras-list-col';
  const ul = document.createElement('ul');
  ul.className = 'yacht-extras-list';

  serviceRows.forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    li.className = 'yacht-extras-item';

    const name = document.createElement('span');
    name.className = 'yacht-extras-name';
    if (cols[0]) name.append(...cols[0].childNodes);

    const price = document.createElement('span');
    price.className = 'yacht-extras-price';
    if (cols[1]) price.append(...cols[1].childNodes);

    li.append(name, price);
    ul.append(li);
  });

  listCol.append(ul);
  container.append(listCol);
  block.append(container);
}
