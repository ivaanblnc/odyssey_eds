import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = block.querySelector('ul');
  if (!ul) return;

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';

  [...ul.children].forEach((li, index) => {
    moveInstrumentation(li, nav);
    const item = document.createElement('span');
    item.className = 'breadcrumb-item';

    // Check if it has a link
    const link = li.querySelector('a');
    if (link) {
      link.className = 'breadcrumb-link';
      item.append(link);
    } else {
      item.textContent = li.textContent;
      item.classList.add('breadcrumb-current');
    }

    nav.append(item);

    // Add separator except for the last item
    if (index < ul.children.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = '/';
      nav.append(separator);
    }
  });

  block.replaceChildren(nav);
}
