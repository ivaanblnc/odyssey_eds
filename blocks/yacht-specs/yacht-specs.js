/**
 * loads and decorates the yacht-specs block
 * @param {Element} block The yacht-specs block element
 */
export default function decorate(block) {
  // Each row = one spec
  // Col 0: Label
  // Col 1: Value
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'yacht-specs-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const item = document.createElement('div');
    item.className = 'yacht-specs-item';

    const label = document.createElement('span');
    label.className = 'yacht-specs-label';
    if (cols[0]) label.append(...cols[0].childNodes);

    const value = document.createElement('span');
    value.className = 'yacht-specs-value';
    if (cols[1]) value.append(...cols[1].childNodes);

    item.append(label, value);
    grid.append(item);
  });

  block.textContent = '';
  block.append(grid);
}
