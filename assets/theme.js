(() => {
  'use strict';

  // ---------- Countdown ----------
  document.querySelectorAll('[data-countdown]').forEach(el => {
    const target = new Date(el.dataset.target).getTime();
    if (Number.isNaN(target)) return;
    const d = el.querySelector('[data-cd="days"]');
    const h = el.querySelector('[data-cd="hours"]');
    const m = el.querySelector('[data-cd="minutes"]');
    const s = el.querySelector('[data-cd="seconds"]');
    const pad = n => String(Math.max(0, n)).padStart(2, '0');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        d.textContent = h.textContent = m.textContent = s.textContent = '00';
        return false;
      }
      d.textContent = pad(Math.floor(diff / 86400000));
      h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      m.textContent = pad(Math.floor((diff % 3600000) / 60000));
      s.textContent = pad(Math.floor((diff % 60000) / 1000));
      return true;
    };
    if (tick()) setInterval(tick, 1000);
  });

  // ---------- Cart drawer ----------
  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-overlay]');
  const openButtons = document.querySelectorAll('[data-cart-toggle]');
  const closeButtons = document.querySelectorAll('[data-cart-close]');

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay && overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    drawer.setAttribute('aria-hidden', 'false');
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay && overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    drawer.setAttribute('aria-hidden', 'true');
  };
  openButtons.forEach(b => b.addEventListener('click', openDrawer));
  closeButtons.forEach(b => b.addEventListener('click', closeDrawer));
  overlay && overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // ---------- Cart fetch helpers ----------
  const refreshCart = async () => {
    try {
      const res = await fetch(`${window.routes.cart_url}?section_id=cart-drawer-contents`);
      const html = await res.text();
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const fresh = tmp.querySelector('[data-cart-drawer-contents]');
      const target = document.querySelector('[data-cart-drawer-contents]');
      if (fresh && target) target.innerHTML = fresh.innerHTML;

      const cartRes = await fetch(`${window.routes.cart_url}.js`);
      const cart = await cartRes.json();
      document.querySelectorAll('[data-cart-count]').forEach(n => n.textContent = cart.item_count);
      bindCartEvents();
    } catch (err) {
      console.error('Cart refresh failed', err);
    }
  };

  const bindCartEvents = () => {
    document.querySelectorAll('[data-cart-line-remove]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const line = btn.dataset.cartLineRemove;
        await fetch(window.routes.cart_change_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: parseInt(line, 10), quantity: 0 })
        });
        refreshCart();
      });
    });
    document.querySelectorAll('[data-cart-qty]').forEach(input => {
      input.addEventListener('change', async (e) => {
        const line = input.dataset.cartQty;
        const qty = parseInt(input.value, 10);
        await fetch(window.routes.cart_change_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: parseInt(line, 10), quantity: qty })
        });
        refreshCart();
      });
    });
  };
  bindCartEvents();

  // ---------- PDP add to cart ----------
  document.querySelectorAll('[data-product-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn && btn.textContent;
      if (btn) { btn.disabled = true; btn.textContent = 'ADDING…'; }
      const formData = new FormData(form);
      try {
        const res = await fetch(`${window.routes.cart_add_url}.js`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.description || 'Could not add to bag.');
        }
        await refreshCart();
        openDrawer();
        if (btn) { btn.textContent = 'ADDED'; setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1200); }
      } catch (err) {
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
        const error = form.querySelector('[data-form-error]');
        if (error) { error.textContent = err.message; error.hidden = false; }
      }
    });
  });

  // ---------- PDP variant picker ----------
  document.querySelectorAll('[data-variant-form]').forEach(form => {
    const variantInput = form.querySelector('[name="id"]');
    const priceEl = document.querySelector('[data-price]');
    const submitBtn = form.querySelector('[type="submit"]');
    const variants = (() => {
      try { return JSON.parse(form.dataset.variants || '[]'); } catch { return []; }
    })();

    const update = () => {
      const selected = [...form.querySelectorAll('[name^="option"]:checked')].map(i => i.value);
      const match = variants.find(v => JSON.stringify(v.options) === JSON.stringify(selected));
      if (!match) return;
      variantInput.value = match.id;
      if (priceEl && match.price != null) {
        priceEl.textContent = formatMoney(match.price);
      }
      if (submitBtn) {
        if (match.available) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'ADD TO BAG';
        } else {
          submitBtn.disabled = true;
          submitBtn.textContent = 'SOLD OUT';
        }
      }
    };

    form.querySelectorAll('[name^="option"]').forEach(input => {
      input.addEventListener('change', update);
    });
    update();
  });

  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    return `$${amount.replace(/\.00$/, '')}`;
  }
})();
