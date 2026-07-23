import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { getFleet } from '../../scripts/api.js';

export default function decorate(block) {
  const isDestinations = block.classList.contains('destinations');
  const isFleet = block.classList.contains('fleet');

  const ul = document.createElement('ul');
  [...block.children].forEach((row, i) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      const textContent = div.textContent?.trim();
      const isRawImage = textContent && (textContent.endsWith('.jpg') || textContent.endsWith('.png') || textContent.endsWith('.jpeg') || textContent.endsWith('.webp'));

      if ((div.children.length === 1 && div.querySelector('picture')) || isRawImage) {
        div.className = 'cards-card-image';

        if (isRawImage) {
          div.innerHTML = `<picture><img src="${textContent}" alt=""></picture>`;
        }

        if (isDestinations || isFleet) {
          const num = document.createElement('div');
          num.className = isFleet ? 'fleet-number' : 'dest-number';
          num.textContent = `N°0${i + 1}`;
          div.append(num);
        }

        if (isFleet) {
          const tag = document.createElement('div');
          tag.className = 'fleet-tag';
          tag.innerHTML = '<span class="fleet-tag-dot"></span> Exclusivo';
          div.append(tag);
        }
      } else {
        div.className = 'cards-card-body';

        if (isDestinations || isFleet) {
          const elements = [...div.children];
          if (elements.length >= 2) {
            const region = elements[0]?.textContent || '';
            const nameEl = elements.find((el) => el.tagName.match(/^H[1-6]$/)) || elements[1];
            const name = nameEl?.textContent || '';

            let priceLabel = 'Desde';
            let price = '';

            if (isFleet) {
              priceLabel = 'Desde / sem.';
              price = elements.find((el) => el.textContent.includes('€'))?.textContent || '';
            } else {
              priceLabel = elements[elements.length - 2]?.textContent || 'Desde';
              price = elements[elements.length - 1]?.textContent || '';
            }

            const headerHtml = `
              <div class="dest-top">
                <div class="dest-left">
                  <div class="dest-region">${region}</div>
                  <h3 class="dest-title">${name}</h3>
                </div>
                <div class="dest-right">
                  <div class="dest-price-label">${priceLabel}</div>
                  <div class="dest-price">${price}</div>
                </div>
              </div>
            `;

            div.innerHTML = headerHtml;

            if (isFleet) {
              const listEl = elements.find((el) => el.tagName === 'UL' || el.tagName === 'OL');
              if (listEl) {
                const dl = document.createElement('dl');
                dl.className = 'fleet-specs';
                [...listEl.children].forEach((item) => {
                  const text = item.textContent;
                  const parts = text.split(':');
                  const dt = parts[0] ? parts[0].trim() : '';
                  const dd = parts[1] ? parts[1].trim() : text;
                  dl.innerHTML += `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
                });
                div.append(dl);
              }

              const footer = document.createElement('div');
              footer.className = 'fleet-footer';
              footer.innerHTML = `
                <span>Base · Mediterráneo</span>
                <span class="fleet-link">Ver ficha &nbsp;→</span>
              `;
              div.append(footer);
            }
          }
        }
      }
    });
    ul.append(li);
  });

  if (isFleet) {
    const filter = document.createElement('div');
    filter.className = 'fleet-filters';
    filter.innerHTML = `
      <div class="fleet-filters-scroll">
        <span class="active">Todas · 42</span>
        <span>Catamarán · 18</span><span>Velero · 14</span><span>Megayate · 07</span><span>Gulet · 03</span>
      </div>
    `;
    block.replaceChildren(filter, ul);
  } else {
    block.replaceChildren(ul);
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);

  if (isFleet) {
    // Hydrate availability dynamically
    getFleet('all').then((fleetData) => {
      if (!fleetData || fleetData.length === 0) return;
      const cards = ul.querySelectorAll('li');
      cards.forEach((card) => {
        const titleEl = card.querySelector('.dest-title');
        if (!titleEl) return;
        const yName = titleEl.textContent.toLowerCase();
        const match = fleetData.find((y) => yName.includes(y.name?.toLowerCase() || '') || (y.name && y.name.toLowerCase().includes(yName)));

        if (match) {
          const tag = card.querySelector('.fleet-tag');
          if (tag) {
            if (match.status === 'booked' || match.status === 'reservado') {
              tag.innerHTML = '<span class="fleet-tag-dot" style="background:var(--error, #dc3545);"></span> Reservado';
            } else if (match.status === 'available') {
              tag.innerHTML = '<span class="fleet-tag-dot" style="background:var(--success, #28a745);"></span> Disponible';
            }
          }
          if (match.price) {
            const pEl = card.querySelector('.dest-price');
            if (pEl) pEl.textContent = match.price;
          }
        }
      });
    }).catch(() => {});
  }
}
