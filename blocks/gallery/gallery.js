export default function decorate(block) {
  const rows = Array.from(block.children);
  if (rows.length === 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'gallery-wrapper';

  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  rows.forEach((row, idx) => {
    const item = document.createElement('div');
    item.className = `gallery-item item-${idx + 1}`;

    const pic = row.querySelector('picture');
    if (pic) {
      // Clean up empty wrapping divs AEM might create around picture
      item.append(pic);
    } else {
      // fallback if no picture
      item.innerHTML = row.innerHTML;
    }

    // Add overlay for the 5th item if there are more than 5 images total
    // (Wait, actually Lovable just shows + X photos on the last one if we have more, or exactly on the 5th)
    // The design shows a 5 image grid in desktop. If there are 5 or more, 5th gets overlay in desktop.
    // Let's always just render 5 items in DOM to match the CSS grid perfectly, or we render all and hide > 5?
    // Let's render all but in CSS we will hide .item-6 and above.
    
    if (idx === 4 && rows.length > 5) {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      overlay.innerHTML = `+ ${rows.length - 4} fotos`;
      item.append(overlay);
    }

    grid.append(item);
  });

  wrapper.append(grid);
  block.textContent = '';
  block.append(wrapper);
}
