/**
 * loads and decorates the yacht-gallery block
 * @param {Element} block The yacht-gallery block element
 */
export default function decorate(block) {
  // Each row = one gallery image
  // Col 0: Image (picture)
  const rows = [...block.children];

  block.textContent = '';

  // Mobile scroller
  const mobileScroller = document.createElement('div');
  mobileScroller.className = 'yacht-gallery-mobile';

  // Desktop masonry grid
  const desktopGrid = document.createElement('div');
  desktopGrid.className = 'yacht-gallery-desktop';

  rows.forEach((row, i) => {
    const picture = row.querySelector('picture');
    if (!picture) return;

    // Mobile slide
    const mobileSlide = document.createElement('div');
    mobileSlide.className = 'yacht-gallery-slide';
    const mobilePic = picture.cloneNode(true);
    mobileSlide.append(mobilePic);

    // Last image overlay
    if (i === rows.length - 1 && rows.length > 1) {
      const overlay = document.createElement('div');
      overlay.className = 'yacht-gallery-more';
      overlay.textContent = `+ ${rows.length} fotos`;
      mobileSlide.append(overlay);
    }
    mobileScroller.append(mobileSlide);

    // Desktop cell
    const cell = document.createElement('div');
    cell.className = 'yacht-gallery-cell';
    if (i === 0) cell.classList.add('yacht-gallery-cell-hero');
    cell.append(picture);

    if (i === rows.length - 1 && rows.length > 1) {
      const overlay = document.createElement('div');
      overlay.className = 'yacht-gallery-more';
      overlay.textContent = `+ ${rows.length} fotos`;
      cell.append(overlay);
    }
    desktopGrid.append(cell);
  });

  block.append(mobileScroller, desktopGrid);
}
