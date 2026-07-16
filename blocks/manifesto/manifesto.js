/**
 * loads and decorates the manifesto block
 * @param {Element} block The manifesto block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // We expect:
  // Row 1: Eyebrow text
  // Row 2: Headline
  // Row 3: Left paragraph
  // Row 4: Right paragraph

  // Row 5: Subtitle (optional)
  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const headlineHtml = rows[1]?.querySelector('div')?.innerHTML || '';
  const leftColHtml = rows[2]?.querySelector('div')?.innerHTML || '';
  const rightColHtml = rows[3]?.querySelector('div')?.innerHTML || '';
  const subtitleText = rows[4]?.textContent?.trim() || '';

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'manifesto-grid';

  // Left side (eyebrow & optional subtitle)
  const left = document.createElement('div');
  left.className = 'manifesto-left';
  left.innerHTML = `<div class="manifesto-eyebrow">${eyebrowText}</div>`;
  if (subtitleText) {
    left.innerHTML += `<div class="manifesto-subtitle">${subtitleText}</div>`;
  }
  grid.append(left);

  // Right side (content)
  const right = document.createElement('div');
  right.className = 'manifesto-right';

  const h2 = document.createElement('h2');
  h2.className = 'manifesto-title';
  h2.innerHTML = headlineHtml;
  right.append(h2);

  const columns = document.createElement('div');
  columns.className = 'manifesto-columns';

  if (block.classList.contains('bay')) {
    columns.classList.add('bay-variant');
    columns.innerHTML = `<div>${leftColHtml}</div>`;
  } else {
    columns.innerHTML = `
      <div>${leftColHtml}</div>
      <div>${rightColHtml}</div>
    `;
  }
  right.append(columns);

  grid.append(right);
  block.append(grid);
}
