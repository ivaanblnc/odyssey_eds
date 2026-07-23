/**
 * loads and decorates the manifesto block
 * @param {Element} block The manifesto block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: eyebrow
  // Row 1: headline
  // Row 2: subtitle
  // Row 3: image1, Row 4: text1
  // Row 5: image2, Row 6: text2
  // Row 7: image3, Row 8: text3
  const eyebrowText = rows[0]?.textContent?.trim() || '';
  const headlineHtml = rows[1]?.querySelector('div')?.innerHTML || '';
  const subtitleText = rows[2]?.textContent?.trim() || '';

  // Extract pairs of image/text
  const slides = [];
  for (let i = 3; i < rows.length; i += 2) {
    if (rows[i] && rows[i+1]) {
      const picture = rows[i].querySelector('picture');
      const textHtml = rows[i+1].querySelector('div')?.innerHTML || '';
      if (picture && textHtml) {
        slides.push({ picture, textHtml });
      }
    }
  }

  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'manifesto-header';
  
  if (eyebrowText) header.innerHTML += `<div class="manifesto-eyebrow">${eyebrowText}</div>`;
  if (headlineHtml) header.innerHTML += `<h2 class="manifesto-title">${headlineHtml}</h2>`;
  if (subtitleText) header.innerHTML += `<div class="manifesto-subtitle">${subtitleText}</div>`;
  
  block.append(header);

  if (slides.length > 0) {
    const carousel = document.createElement('div');
    carousel.className = 'manifesto-carousel';

    slides.forEach((slide) => {
      const card = document.createElement('div');
      card.className = 'manifesto-card';
      
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'manifesto-card-image';
      imgWrapper.append(slide.picture);

      const textWrapper = document.createElement('div');
      textWrapper.className = 'manifesto-card-text';
      textWrapper.innerHTML = slide.textHtml;

      card.append(imgWrapper, textWrapper);
      carousel.append(card);
    });

    block.append(carousel);
  }
}
