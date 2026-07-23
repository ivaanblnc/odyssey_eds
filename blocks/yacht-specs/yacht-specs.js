export default function decorate(block) {
  const rows = Array.from(block.children);
  if (rows.length < 2) return;

  // Extract Eyebrow and Title (first two rows)
  const eyebrowRow = rows[0];
  const titleRow = rows[1];

  const eyebrowText = eyebrowRow.textContent.trim();
  const titleText = titleRow.textContent.trim();

  // Create new DOM structure
  const wrapper = document.createElement('div');
  wrapper.className = 'yacht-specs-wrapper';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'yacht-specs-eyebrow';
  eyebrow.textContent = eyebrowText;

  const title = document.createElement('h2');
  title.className = 'yacht-specs-title';
  title.textContent = titleText;

  const grid = document.createElement('div');
  grid.className = 'yacht-specs-grid';

  // Process spec items (remaining rows)
  for (let i = 2; i < rows.length; i += 1) {
    const row = rows[i];
    const cols = Array.from(row.children);
    if (cols.length >= 2) {
      const item = document.createElement('div');
      item.className = 'yacht-specs-item';

      const label = document.createElement('span');
      label.className = 'yacht-specs-label';
      // keep inner elements if there are spans/strongs, else text
      label.append(...cols[0].childNodes);

      const value = document.createElement('span');
      value.className = 'yacht-specs-value';
      value.append(...cols[1].childNodes);

      item.append(label, value);
      grid.append(item);
    }
  }

  wrapper.append(eyebrow, title, grid);

  // Clear original block and append new structure
  block.textContent = '';
  block.append(wrapper);

  // Section background color should ideally be handled by Section Metadata in AEM,
  // but if we want to force the Mist background, we can add a class to the block itself.
  block.classList.add('bg-mist');
}
