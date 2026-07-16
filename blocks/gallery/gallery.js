import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Extract all images
  const pictures = [...block.querySelectorAll('picture')];
  if (!pictures.length) return;

  const totalImages = pictures.length;
  // We only display the first 5 in the UI layout
  const displayLimit = 5;
  const remaining = totalImages > displayLimit ? totalImages - displayLimit : 0;

  block.textContent = '';

  // Mobile container (Horizontal Scroll)
  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'gallery-mobile';

  // Desktop container (Masonry Grid)
  const desktopContainer = document.createElement('div');
  desktopContainer.className = 'gallery-desktop';

  pictures.forEach((pic, i) => {
    if (i >= displayLimit) return; // Skip extra images for layout

    // Optimize images
    const img = pic.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);

    // Create mobile slide
    const mSlide = document.createElement('div');
    mSlide.className = 'gallery-mobile-slide';
    mSlide.append(optimizedPic.cloneNode(true));

    if (i === displayLimit - 1 && remaining > 0) {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      overlay.textContent = `+ ${remaining} fotos`;
      mSlide.append(overlay);
    }
    mobileContainer.append(mSlide);

    // Create desktop grid item
    const dItem = document.createElement('div');
    dItem.className = `gallery-desktop-item item-${i}`;
    dItem.append(optimizedPic.cloneNode(true));

    if (i === displayLimit - 1 && remaining > 0) {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      overlay.textContent = `+ ${remaining} fotos`;
      dItem.append(overlay);
    }
    desktopContainer.append(dItem);
  });

  block.append(mobileContainer);
  block.append(desktopContainer);
}
