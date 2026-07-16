/**
 * loads and decorates the destinations block
 * @param {Element} block The destinations block element
 */
export default function decorate(block) {
  // Each row = one destination card
  // Col 0: Image (picture)
  // Col 1: Content (richtext: region, name, price)
  // Col 2: Link (optional, as <a>)
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'destinations-grid';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'destinations-card';

    // Image container
    const imgWrap = document.createElement('div');
    imgWrap.className = 'destinations-img-wrap';
    const picture = cols[0]?.querySelector('picture');
    if (picture) imgWrap.append(picture);

    // Number overlay
    const num = document.createElement('div');
    num.className = 'destinations-number';
    num.textContent = `N\u00B00${i + 1}`;
    imgWrap.append(num);
    card.append(imgWrap);

    // Content
    if (cols[1]) {
      const info = document.createElement('div');
      info.className = 'destinations-info';
      cols[1].classList.add('destinations-content');
      info.append(cols[1]);
      card.append(info);
    }

    // Wrap in link if present
    const link = cols[2]?.querySelector('a');
    if (link) {
      link.className = 'destinations-link';
      link.textContent = '';
      link.append(card);
      grid.append(link);
    } else {
      grid.append(card);
    }
  });

  block.textContent = '';
  block.append(grid);
}
