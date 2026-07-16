/**
 * loads and decorates the manifesto block
 * @param {Element} block The manifesto block element
 */
export default function decorate(block) {
  // Expected matrix rows:
  // Row 0: eyebrow
  // Row 1: heading (richtext)
  // Row 2: left paragraph
  // Row 3: right paragraph
  const rows = [...block.children];
  const eyebrowRow = rows[0];
  const headingRow = rows[1];
  const textLeftRow = rows[2];
  const textRightRow = rows[3];

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'manifesto-grid';

  // Left column — eyebrow
  const leftCol = document.createElement('div');
  leftCol.className = 'manifesto-left';
  if (eyebrowRow) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'manifesto-eyebrow';
    const val = eyebrowRow.querySelector('div:last-child') || eyebrowRow;
    eyebrow.append(...val.childNodes);
    leftCol.append(eyebrow);
  }
  container.append(leftCol);

  // Right column — heading + two paragraphs
  const rightCol = document.createElement('div');
  rightCol.className = 'manifesto-right';

  if (headingRow) {
    const h2 = document.createElement('h2');
    h2.className = 'manifesto-heading';
    const val = headingRow.querySelector('div:last-child') || headingRow;
    h2.append(...val.childNodes);
    rightCol.append(h2);
  }

  const textGrid = document.createElement('div');
  textGrid.className = 'manifesto-text-grid';

  if (textLeftRow) {
    const p = document.createElement('p');
    p.className = 'manifesto-text';
    const val = textLeftRow.querySelector('div:last-child') || textLeftRow;
    p.append(...val.childNodes);
    textGrid.append(p);
  }

  if (textRightRow) {
    const p = document.createElement('p');
    p.className = 'manifesto-text';
    const val = textRightRow.querySelector('div:last-child') || textRightRow;
    p.append(...val.childNodes);
    textGrid.append(p);
  }

  rightCol.append(textGrid);
  container.append(rightCol);
  block.append(container);
}
