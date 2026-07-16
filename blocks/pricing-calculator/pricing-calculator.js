import { calculateQuote } from '../../scripts/api.js';

/**
 * loads and decorates the pricing-calculator block
 * @param {Element} block The pricing-calculator block element
 */
export default function decorate(block) {
  // Row 0: title
  // Row 1: basePrice
  // Row 2: extrasTitle
  // Row 3: ctaText
  const rows = [...block.children];
  const getValue = (row) => row?.querySelector('div:last-child')?.textContent?.trim() || '';

  const title = getValue(rows[0]) || 'Calcula tu presupuesto';
  const basePriceStr = getValue(rows[1]) || '28900';
  const basePrice = parseInt(basePriceStr, 10) || 0;
  const extrasTitle = getValue(rows[2]) || 'Servicios Adicionales';
  const ctaText = getValue(rows[3]) || 'Solicitar Reserva';

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'pricing-calculator-container';

  // Header
  const header = document.createElement('div');
  header.className = 'pricing-calculator-header';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  header.append(h2);
  container.append(header);

  // Form body
  const body = document.createElement('div');
  body.className = 'pricing-calculator-body';

  // Date selection (mocked UI for calendar)
  const dateGroup = document.createElement('div');
  dateGroup.className = 'pricing-calculator-group';
  dateGroup.innerHTML = `
    <label class="pricing-calculator-label">Fechas de reserva</label>
    <div class="pricing-calculator-dates">
      <input type="date" class="pricing-calculator-input" id="calc-start" placeholder="Inicio">
      <input type="date" class="pricing-calculator-input" id="calc-end" placeholder="Fin">
    </div>
  `;
  body.append(dateGroup);

  // Extras selection
  const extrasGroup = document.createElement('div');
  extrasGroup.className = 'pricing-calculator-group';
  extrasGroup.innerHTML = `
    <label class="pricing-calculator-label">${extrasTitle}</label>
    <div class="pricing-calculator-extras">
      <label class="pricing-calculator-checkbox">
        <input type="checkbox" value="chef" data-price="480">
        <span>Chef privado (+480€)</span>
      </label>
      <label class="pricing-calculator-checkbox">
        <input type="checkbox" value="captain" data-price="350">
        <span>Capitán experto (+350€)</span>
      </label>
      <label class="pricing-calculator-checkbox">
        <input type="checkbox" value="scuba" data-price="120">
        <span>Equipamiento de buceo (+120€)</span>
      </label>
    </div>
  `;
  body.append(extrasGroup);

  container.append(body);

  // Total footer
  const footer = document.createElement('div');
  footer.className = 'pricing-calculator-footer';

  const totalWrap = document.createElement('div');
  totalWrap.className = 'pricing-calculator-total-wrap';
  totalWrap.innerHTML = `
    <span class="pricing-calculator-total-label">Total estimado:</span>
    <span class="pricing-calculator-total-price" id="calc-total">€ ${basePrice.toLocaleString()}</span>
  `;
  footer.append(totalWrap);

  const ctaBtn = document.createElement('button');
  ctaBtn.className = 'pricing-calculator-cta';
  ctaBtn.textContent = ctaText;
  footer.append(ctaBtn);

  container.append(footer);
  block.append(container);

  // State and Logic
  const totalEl = block.querySelector('#calc-total');
  const checkboxes = block.querySelectorAll('input[type="checkbox"]');
  const dateInputs = block.querySelectorAll('input[type="date"]');
  const cta = block.querySelector('.pricing-calculator-cta');

  let debounceTimer;

  const updatePrice = async () => {
    const selectedExtras = Array.from(checkboxes).filter((cb) => cb.checked).map((cb) => cb.value);

    // UI Feedback: Show loading state
    totalEl.classList.add('pricing-calculator-total-price-loading');
    totalEl.textContent = 'Calculando...';
    cta.disabled = true;

    try {
      const payload = {
        basePrice,
        extras: selectedExtras,
        startDate: block.querySelector('#calc-start').value,
        endDate: block.querySelector('#calc-end').value,
      };

      // Call the Go backend via api.js
      const quote = await calculateQuote(payload);

      if (quote && quote.data) {
        totalEl.textContent = `€ ${quote.data.total.toLocaleString()}`;
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error calculando precio', err);
      totalEl.textContent = 'Error';
    } finally {
      totalEl.classList.remove('pricing-calculator-total-price-loading');
      cta.disabled = false;
    }
  };

  const handleInteraction = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePrice, 400); // 400ms debounce
  };

  checkboxes.forEach((cb) => cb.addEventListener('change', handleInteraction));
  dateInputs.forEach((input) => input.addEventListener('change', handleInteraction));
}
