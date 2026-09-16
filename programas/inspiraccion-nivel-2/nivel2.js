(() => {
  const root = document.querySelector('[data-pricing]');
  if (!root) return;
  const today = new Date();
  const dateKey = Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`);
  const stages = dateKey <= 20261015 ? {
    label: 'Early bird · Cupos limitados', deadline: 'Early bird · Hasta el 15/10', value: 'USD 300',
    copy: 'Ahorrás USD 100 sobre el valor de lista. Congelalo abonando <b>USD 150 ahora</b> y completá el 50% restante hasta el 5 de enero.',
    cta: 'Quiero asegurar mi lugar con USD 150'
  } : dateKey <= 20261105 ? {
    label: 'Valor vigente · Cupos limitados', deadline: 'Disponible hasta el 5/11', value: 'USD 350',
    copy: 'Ahorrás USD 50 sobre el valor de lista. Congelalo abonando <b>USD 175 ahora</b> y completá el 50% restante hasta el 5 de enero.',
    cta: 'Quiero asegurar mi lugar con USD 175'
  } : {
    label: 'Inscripción · Cupos limitados', deadline: 'Valor vigente', value: 'USD 400',
    copy: 'Este es el valor de lista de la experiencia. Escribinos para completar tu inscripción antes del inicio.',
    cta: 'Quiero asegurar mi lugar'
  };
  root.querySelector('[data-stage-label]').textContent = stages.label;
  root.querySelector('[data-stage-deadline]').textContent = stages.deadline;
  root.querySelector('[data-current-value]').textContent = stages.value;
  root.querySelector('[data-stage-copy]').innerHTML = stages.copy;
  root.querySelector('[data-stage-cta]').textContent = stages.cta;
  document.querySelectorAll('[data-value-link]').forEach(link => { link.textContent = dateKey <= 20261015 ? 'Ver valor early bird' : 'Ver valor vigente'; });
  const question = document.querySelector('[data-reserve-question]');
  const answer = document.querySelector('[data-reserve-answer]');
  if (question && answer && dateKey > 20261015) {
    question.textContent = '¿Cómo reservo mi lugar?';
    answer.textContent = dateKey <= 20261105
      ? 'Hasta el 5 de noviembre de 2026, el valor vigente es USD 350. Lo congelás abonando USD 175 (el 50%). El saldo de USD 175 debe estar abonado a más tardar el 5 de enero de 2027. Tu reserva queda confirmada cuando el equipo verifica el pago.'
      : 'El valor de la experiencia es USD 400 y se abona completo. Tu lugar queda confirmado cuando el equipo verifica el pago.';
  }
  if (dateKey > 20261105) root.querySelector('.list-reference')?.remove();
  const joseLink = [...document.querySelectorAll('a')].find(link => link.textContent.includes('Hablar con Jose'));
  if (joseLink) joseLink.href = 'https://wa.me/5219981797419?text=Hola%20Jose%2C%20quiero%20inscribirme%20a%20InspirAcci%C3%B3n%20Nivel%202%20%C2%B7%20Generaci%C3%B3n%204%20y%20necesito%20conocer%20otras%20opciones%20de%20pago.%20%C2%BFMe%20pod%C3%A9s%20asesorar%3F';
})();

(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx3x1fWyfwaeHGXQa4GN0QI9bIVDLVTVak6mUMB3SOpHqEbaudkqre6y_zggHMpRASf/exec';
  const form = document.querySelector('#enrollment-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const result = document.querySelector('.payment-result');
  const instructions = result.querySelector('[data-payment-instructions]');
  const receipt = result.querySelector('[data-receipt-link]');
  const paymentCopy = {
    ARS_GALICIA: '<p><b>Transferencia en pesos argentinos · Banco Galicia</b></p><p>Alias: <strong>Epi.arg</strong><br>CBU: <strong>0070267830004086914782</strong></p>',
    USD_GALICIA: '<p><b>Transferencia bancaria en dólares · Banco Galicia</b></p><p>Titular: Agustín Darío Trowell Kissam<br>CBU: <strong>0070267831004062922717</strong></p>',
    WISE: '<p><b>Pago internacional mediante Wise</b></p><p><a href="https://wise.com/pay/me/agustindariot" target="_blank" rel="noopener">Abrir Wise para realizar el pago ↗</a></p>',
    PAYPAL: '<p><b>Pago internacional mediante PayPal</b></p><p><a href="https://paypal.me/AgustinTrowellKissam" target="_blank" rel="noopener">Abrir PayPal para realizar el pago ↗</a></p><p>PayPal tiene un 5% de recargo.</p>',
    OTHER: '<p>Consultá con Jose la cotización del día y el medio de pago adecuado para tu moneda.</p>'
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    button.disabled = true; status.textContent = 'Registrando tus datos…';
    try {
      if (!ENDPOINT) throw new Error('La integración todavía no fue activada.');
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error || 'No pudimos registrar la reserva.');
      const amount = payload.reserve;
      instructions.innerHTML = `<p class="reservation-summary">Reserva vigente: <strong>USD ${amount}</strong></p>${paymentCopy[data.paymentMethod]}`;
      let detail = 'La reserva indicada es USD ' + amount + '.';
      const quote = payload.quote;
      if (data.paymentMethod === 'ARS_GALICIA') {
        const block = document.createElement('div');
        if (quote && Number.isFinite(Number(quote.sell)) && Number(quote.sell) > 0) {
          const pesos = Math.ceil(amount * Number(quote.sell));
          const fmt = new Intl.NumberFormat('es-AR');
          const total = document.createElement('p');
          total.className = 'reservation-summary';
          total.textContent = 'Importe a transferir: ARS ' + fmt.format(pesos);
          const source = document.createElement('p');
          source.className = 'quote-note';
          source.textContent = 'Dólar blue venta: ARS ' + fmt.format(quote.sell) + ' por USD · Cotización actualizada por DólarHoy: ' + quote.updatedAt;
          const link = document.createElement('a');
          link.href = 'https://dolarhoy.com/cotizaciondolarblue';
          link.target = '_blank'; link.rel = 'noopener';
          link.textContent = 'Ver la fuente en DólarHoy ↗';
          block.append(total, source, link);
          detail += ' Equivalente mostrado: ARS ' + pesos + ', con blue venta ARS ' + quote.sell + ' (DólarHoy, ' + quote.updatedAt + ').';
        } else {
          block.textContent = 'No pudimos consultar la cotización. Antes de transferir, consultá el importe con Jose. No mostramos un valor anterior como si fuera actual.';
          detail += ' Necesito confirmar el importe en pesos antes de transferir.';
        }
        instructions.append(block);
      }
      if (data.paymentMethod === 'PAYPAL') {
        const surcharge = document.createElement('p');
        surcharge.textContent = 'Total a abonar por PayPal, incluido el 5% de recargo: USD ' + (amount * 1.05).toFixed(2);
        instructions.append(surcharge);
      }
      const consultation = data.paymentMethod === 'OTHER' || (data.paymentMethod === 'ARS_GALICIA' && (!quote || !Number.isFinite(Number(quote.sell)) || Number(quote.sell) <= 0));
      const interest = data.formationInterest === 'yes' ? ' También me interesa la Formación en el Método; quisiera que lo tengan en cuenta al asesorarme sobre la continuidad y el pago.' : '';
      const message = `Hola Jose, soy ${data.name}. Registré mis datos para InspirAcción Nivel 2 · Generación 4. Email: ${data.email}. WhatsApp: ${data.whatsapp}. País: ${data.country}. Nivel 1: ${data.generation}. Elegí ${form.elements.paymentMethod.selectedOptions[0].textContent}. ${detail} ${consultation ? 'Quisiera consultar las opciones de pago.' : 'Te envío el comprobante por acá.'}${interest}`;
      receipt.textContent = consultation ? 'Consultar el pago por WhatsApp' : 'Enviar comprobante por WhatsApp';
      receipt.href = `https://wa.me/5219981797419?text=${encodeURIComponent(message)}`;
      form.hidden = true; result.hidden = false; result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) { status.textContent = error.message + ' Podés consultar a Jose por WhatsApp.'; button.disabled = false; }
  });
})();

(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#landing-nav');
  if (!button || !nav) return;
  const close = () => { nav.removeAttribute('data-open'); button.setAttribute('aria-expanded', 'false'); };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); button.focus(); } });
  const targets = [...nav.querySelectorAll('a')].map(link => document.querySelector(link.hash)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const floating = document.querySelector('.jose-float');
    const enrollment = document.querySelector('#inscripcion');
    if (floating && enrollment) {
      const formObserver = new IntersectionObserver(entries => { entries.forEach(entry => { floating.hidden = entry.isIntersecting; }); }, { threshold: 0 });
      formObserver.observe(enrollment);
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    targets.forEach(target => observer.observe(target));
  }
})();
