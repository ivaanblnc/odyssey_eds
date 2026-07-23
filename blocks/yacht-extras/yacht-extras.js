export default function decorate(block) {
  const rows = Array.from(block.children);
  if (rows.length < 3) return;

  // Extract Eyebrow, Title, Description
  const eyebrowRow = rows[0];
  const titleRow = rows[1];
  const descRow = rows[2];

  const eyebrowText = eyebrowRow.textContent.trim();
  const titleHtml = titleRow.innerHTML;
  const descHtml = descRow.innerHTML;

  // Create Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'yacht-extras-wrapper';

  // Left side (Text content)
  const leftCol = document.createElement('div');
  leftCol.className = 'yacht-extras-left';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'yacht-extras-eyebrow';
  eyebrow.textContent = eyebrowText;

  const title = document.createElement('h2');
  title.className = 'yacht-extras-title';
  title.innerHTML = titleRow.children[0]?.innerHTML || titleHtml;

  const desc = document.createElement('div');
  desc.className = 'yacht-extras-description';
  desc.innerHTML = descRow.children[0]?.innerHTML || descHtml;

  leftCol.append(eyebrow, title, desc);

  // Right side (List)
  const rightCol = document.createElement('div');
  rightCol.className = 'yacht-extras-right';

  const list = document.createElement('ul');
  list.className = 'yacht-extras-list';

  // Process extra items (remaining rows)
  for (let i = 3; i < rows.length; i += 1) {
    const row = rows[i];
    const cols = Array.from(row.children);
    if (cols.length >= 2) {
      const item = document.createElement('li');
      item.className = 'yacht-extras-item';

      const name = document.createElement('span');
      name.className = 'yacht-extras-name';
      name.append(...cols[0].childNodes);

      const price = document.createElement('span');
      price.className = 'yacht-extras-price';
      price.append(...cols[1].childNodes);

      item.append(name, price);
      list.append(item);
    }
  }

  rightCol.append(list);
  wrapper.append(leftCol, rightCol);

  // Clear and append
  block.textContent = '';
  block.append(wrapper);
}
