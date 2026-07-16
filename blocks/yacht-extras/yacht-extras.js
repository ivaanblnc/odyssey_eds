export default function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const titleText = rows[1]?.textContent?.trim() || '';
  const descHtml = rows[2]?.querySelector('div')?.innerHTML || '';
  const extrasTable = rows[3]?.querySelector('table');

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'yacht-extras-grid';

  // Left Column
  const left = document.createElement('div');
  left.className = 'yacht-extras-left';

  if (eyebrowText) {
    left.innerHTML += `<div class="yacht-extras-eyebrow">${eyebrowText}</div>`;
  }
  if (titleText) {
    left.innerHTML += `<h2 class="yacht-extras-title">${titleText}</h2>`;
  }
  if (descHtml) {
    left.innerHTML += `<div class="yacht-extras-desc">${descHtml}</div>`;
  }

  wrapper.append(left);

  // Right Column
  const right = document.createElement('div');
  right.className = 'yacht-extras-right';

  if (extrasTable) {
    const ul = document.createElement('ul');
    ul.className = 'yacht-extras-list';

    // Parse the table
    const trs = extrasTable.querySelectorAll('tr');
    trs.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      if (tds.length >= 2) {
        const li = document.createElement('li');
        li.className = 'yacht-extras-item';
        li.innerHTML = `
          <span class="yacht-extras-name">\${tds[0].innerHTML}</span>
          <span class="yacht-extras-price">\${tds[1].innerHTML}</span>
        `;
        ul.append(li);
      }
    });

    right.append(ul);
  }

  wrapper.append(right);
  block.append(wrapper);
}
