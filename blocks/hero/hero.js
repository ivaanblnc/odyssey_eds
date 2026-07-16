/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Row 0: Image (picture tag from AEM)
  // Row 1: Richtext content (eyebrow, title, desc, stats)
  const rows = [...block.children];
  const imageRow = rows[0];
  const contentRow = rows[1];

  // Extract picture element
  const picture = imageRow?.querySelector('picture');

  // Clear block
  block.textContent = '';

  // Background image
  if (picture) {
    picture.classList.add('hero-bg');
    block.append(picture);
  }

  // Gradient overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  block.append(overlay);

  // Content container
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (contentRow) {
    const val = contentRow.querySelector('div:last-child') || contentRow;
    val.classList.add('hero-body');
    content.append(val);
  }

  block.append(content);
}
