import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the journal block
 * @param {Element} block The journal block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Header row
  const headerRow = rows[0];
  const eyebrowText = headerRow?.querySelector('p')?.textContent || '05 — Diario de a bordo';
  const headlineHtml = headerRow?.querySelector('h1, h2, h3, h4, h5, h6')?.innerHTML || 'Historias de<br /><em>alta mar.</em>';
  const readAllLink = headerRow?.querySelector('a');
  const readAllHref = readAllLink?.href || '#';
  const readAllText = readAllLink?.textContent || 'Leer todo el diario →';

  // Articles rows
  const articleRows = rows.slice(1);

  block.textContent = '';

  // 1. Header
  const header = document.createElement('div');
  header.className = 'journal-header';

  const headerLeft = document.createElement('div');
  headerLeft.innerHTML = `
    <div class="journal-eyebrow">${eyebrowText}</div>
    <h2 class="journal-title">${headlineHtml}</h2>
  `;
  header.append(headerLeft);

  const headerRight = document.createElement('div');
  headerRight.className = 'journal-read-all';
  headerRight.innerHTML = `<a href="${readAllHref}">${readAllText}</a>`;
  header.append(headerRight);

  block.append(header);

  // 2. Grid
  const grid = document.createElement('div');
  grid.className = 'journal-grid';

  articleRows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'journal-card';

    const pic = row.querySelector('picture');
    const cols = [...row.children];
    // assume column 0 is image, column 1 is content
    const contentCol = cols.length > 1 ? cols[1] : cols[0];

    // Extract data from content column
    const elements = [...contentCol.children];
    const date = elements[0]?.textContent || '';
    const titleEl = elements.find((el) => el.tagName.match(/^H[1-6]$/)) || elements[1];
    const title = titleEl?.textContent || '';
    const linkEl = contentCol.querySelector('a');
    const linkHref = linkEl?.href || '#';
    const linkText = linkEl?.textContent || 'Leer artículo →';

    // Image
    const imgDiv = document.createElement('div');
    imgDiv.className = 'journal-card-image';
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt || title, false, [{ width: '400' }]);
        imgDiv.append(optimizedPic);
      }
    }
    card.append(imgDiv);

    // Body
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'journal-card-body';
    bodyDiv.innerHTML = `
      <div class="journal-card-date">${date}</div>
      <h3 class="journal-card-title">${title}</h3>
      <a href="${linkHref}" class="journal-card-link">${linkText}</a>
    `;
    card.append(bodyDiv);

    grid.append(card);
  });

  block.append(grid);
}
