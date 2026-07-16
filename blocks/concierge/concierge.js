/**
 * loads and decorates the concierge block
 * @param {Element} block The concierge block element
 */
export default function decorate(block) {
  // Row 0: Image (picture)
  // Row 1: Eyebrow
  // Row 2: Heading (richtext)
  // Rows 3+: Service items (one per row)
  const rows = [...block.children];
  const imageRow = rows[0];
  const eyebrowRow = rows[1];
  const headingRow = rows[2];
  const serviceRows = rows.slice(3);

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'concierge-grid';

  // Image column
  const imgCol = document.createElement('div');
  imgCol.className = 'concierge-img-col';
  const picture = imageRow?.querySelector('picture');
  if (picture) imgCol.append(picture);
  container.append(imgCol);

  // Text column
  const textCol = document.createElement('div');
  textCol.className = 'concierge-text-col';

  if (eyebrowRow) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'concierge-eyebrow';
    const val = eyebrowRow.querySelector('div:last-child') || eyebrowRow;
    eyebrow.append(...val.childNodes);
    textCol.append(eyebrow);
  }

  if (headingRow) {
    const h2 = document.createElement('h2');
    h2.className = 'concierge-heading';
    const val = headingRow.querySelector('div:last-child') || headingRow;
    h2.append(...val.childNodes);
    textCol.append(h2);
  }

  // Service list
  if (serviceRows.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'concierge-list';
    serviceRows.forEach((row) => {
      const li = document.createElement('li');
      li.className = 'concierge-item';
      const text = document.createElement('span');
      const val = row.querySelector('div:last-child') || row;
      text.append(...val.childNodes);
      const arrow = document.createElement('span');
      arrow.className = 'concierge-arrow';
      arrow.textContent = '→';
      li.append(text, arrow);
      ul.append(li);
    });
    textCol.append(ul);
  }

  container.append(textCol);
  block.append(container);
}
