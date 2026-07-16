export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const titleText = rows[1]?.textContent?.trim() || '';
  const specsTable = rows[2]?.querySelector('table');

  block.textContent = '';

  // Wrap block in a full width section for bg-mist, if not handled by section metadata
  // Since AEM Edge Delivery blocks fill sections, the parent section can be styled with bg-mist,
  // but we can add the inner wrapper here to manage the max-width layout.

  const wrapper = document.createElement('div');
  wrapper.className = 'yacht-specs-wrapper';

  if (eyebrowText) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'yacht-specs-eyebrow';
    eyebrow.textContent = eyebrowText;
    wrapper.append(eyebrow);
  }

  if (titleText) {
    const title = document.createElement('h2');
    title.className = 'yacht-specs-title';
    title.textContent = titleText;
    wrapper.append(title);
  }

  if (specsTable) {
    const grid = document.createElement('div');
    grid.className = 'yacht-specs-grid';

    // Parse the table
    const trs = specsTable.querySelectorAll('tr');
    trs.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      if (tds.length >= 2) {
        const item = document.createElement('div');
        item.className = 'yacht-specs-item';
        item.innerHTML = `
          <span class="yacht-specs-label">\${tds[0].innerHTML}</span>
          <span class="yacht-specs-value">\${tds[1].innerHTML}</span>
        `;
        grid.append(item);
      }
    });

    wrapper.append(grid);
  }

  block.append(wrapper);
}
