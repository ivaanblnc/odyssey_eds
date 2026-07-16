/**
 * loads and decorates the yacht-overview block
 * @param {Element} block The yacht-overview block element
 */
export default function decorate(block) {
  // Row 0: eyebrow
  // Row 1: main content (richtext: heading, desc, features)
  // Row 2: sidebar content (richtext: alert + CTA)
  const rows = [...block.children];

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'yacht-overview-grid';

  // Main content column
  const mainCol = document.createElement('div');
  mainCol.className = 'yacht-overview-main';

  if (rows[0]) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'yacht-overview-eyebrow';
    const val = rows[0].querySelector('div:last-child') || rows[0];
    eyebrow.append(...val.childNodes);
    mainCol.append(eyebrow);
  }

  if (rows[1]) {
    const val = rows[1].querySelector('div:last-child') || rows[1];
    val.classList.add('yacht-overview-body');
    mainCol.append(val);
  }

  container.append(mainCol);

  // Sidebar
  if (rows[2]) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'yacht-overview-sidebar';
    const val = rows[2].querySelector('div:last-child') || rows[2];
    val.classList.add('yacht-overview-sidebar-body');
    sidebar.append(val);
    container.append(sidebar);
  }

  block.append(container);
}
