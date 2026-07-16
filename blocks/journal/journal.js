/**
 * loads and decorates the journal block
 * @param {Element} block The journal block element
 */
export default function decorate(block) {
  // Each row = one journal entry
  // Col 0: Tag
  // Col 1: Title
  // Col 2: Read time
  // Col 3: Link (optional)
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'journal-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const article = document.createElement('article');
    article.className = 'journal-entry';

    const meta = document.createElement('div');
    meta.className = 'journal-meta';
    const tag = document.createElement('span');
    tag.className = 'journal-tag';
    if (cols[0]) tag.append(...cols[0].childNodes);
    const readTime = document.createElement('span');
    readTime.className = 'journal-read-time';
    if (cols[2]) readTime.append(...cols[2].childNodes);
    meta.append(tag, readTime);

    const h3 = document.createElement('h3');
    h3.className = 'journal-title';
    if (cols[1]) h3.append(...cols[1].childNodes);

    article.append(meta, h3);

    // Wrap in link if present
    const link = cols[3]?.querySelector('a');
    if (link) {
      link.className = 'journal-link';
      link.textContent = '';
      link.append(article);
      grid.append(link);
    } else {
      grid.append(article);
    }
  });

  block.textContent = '';
  block.append(grid);
}
