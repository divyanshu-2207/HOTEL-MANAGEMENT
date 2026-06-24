/* ═══════════════════════════════════════
   THE RAJMAHAL GRAND — script.js FINAL
═══════════════════════════════════════ */

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  s1.style.transform = isOpen ? 'rotate(45deg) translateY(7px)' : '';
  s2.style.opacity   = isOpen ? '0' : '';
  s3.style.transform = isOpen ? 'rotate(-45deg) translateY(-7px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── HERO PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      width:${size}px;height:${size}px;
      --dur:${(Math.random()*8+6).toFixed(1)}s;
      --delay:${(Math.random()*5).toFixed(1)}s;
      opacity:${(Math.random()*0.5+0.1).toFixed(2)};
    `;
    container.appendChild(p);
  }
})();

/* ── ANIMATED COUNTERS ── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target).toLocaleString('en-IN');
      if (t < 1) requestAnimationFrame(tick);
    };
    tick();
  });
}
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
}, { threshold: 0.5 }).observe(document.getElementById('hero'));

/* ── MENU TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    if (!panel) return;
    panel.classList.add('active');
    panel.style.cssText = 'opacity:0;transform:translateY(14px);transition:opacity 0.4s ease,transform 0.4s ease;';
    requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateY(0)'; });
  });
});

/* ── CART ── */
let cart = [];

window.addToCart = function(name, price) {
  const existing = cart.find(i => i.name === name);
  existing ? existing.qty++ : cart.push({ name, price, qty: 1 });
  updateCartUI();
  showToast(`✓  ${name} added to order`);
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

function updateCartUI() {
  const total     = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = itemCount;
  document.getElementById('cartTotal').textContent = '₹\u00A0' + total.toLocaleString('en-IN');

  const cartItems = document.getElementById('cartItems');
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color:rgba(250,247,242,0.35);font-size:0.85rem;text-align:center;padding:2.5rem 1rem;">Your order is empty</p>';
    return;
  }
  cartItems.innerHTML = '';
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="cart-item-name">${item.name}${item.qty > 1 ? ' &times; ' + item.qty : ''}</span>
      <span class="cart-item-price">₹\u00A0${(item.price * item.qty).toLocaleString('en-IN')}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})" aria-label="Remove"><i class="fas fa-trash-alt"></i></button>`;
    cartItems.appendChild(div);
  });
}

const cartFab    = document.getElementById('cartFab');
const cartWidget = document.getElementById('cartWidget');
const cartClose  = document.getElementById('cartClose');
cartFab.addEventListener('click', (e) => { e.stopPropagation(); cartWidget.classList.toggle('open'); });
cartClose.addEventListener('click', () => cartWidget.classList.remove('open'));
document.addEventListener('click', (e) => {
  if (!cartWidget.contains(e.target) && !cartFab.contains(e.target)) cartWidget.classList.remove('open');
});

/* ── TOAST ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── BOOKING FORM ── */
const bookingForm    = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

// Set min date = today
const dateInput = document.getElementById('bookDate');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name   = document.getElementById('bookName').value.trim();
    const phone  = document.getElementById('bookPhone').value.trim();
    const date   = document.getElementById('bookDate').value;
    const time   = document.getElementById('bookTime').value;
    const guests = document.getElementById('bookGuests').value;
    if (!name || !phone || !date || !time || !guests) { showToast('Please fill all required fields'); return; }

    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming…';
    btn.disabled = true;

    setTimeout(() => {
      bookingForm.style.display = 'none';
      bookingSuccess.classList.add('show');
    }, 1200);
  });
}

window.resetBooking = function() {
  bookingForm.style.display = '';
  bookingSuccess.classList.remove('show');
  bookingForm.reset();
  const btn = bookingForm.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
  btn.disabled = false;
};

/* ── CONTACT FORM ── */
const contactForm    = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;
    setTimeout(() => {
      contactSuccess.classList.add('show');
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      contactForm.reset();
      setTimeout(() => contactSuccess.classList.remove('show'), 4500);
    }, 1000);
  });
}

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  ['.menu-card','.review-card','.about-visuals','.about-text',
   '.pillar','.contact-card','.book-form-wrap','.review-summary','.bf-item'
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
      revealObs.observe(el);
    });
  });
});

/* ── ACTIVE NAV ON SCROLL ── */
const allSections = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (a) a.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.4 }).observe ? allSections.forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (a) a.style.color = 'var(--gold)';
      }
    });
  }, { threshold: 0.4 }).observe(s);
}) : null;

/* ── SMOOTH SCROLL WITH OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});

/* ── LAZY IMAGE LOAD FADE ── */
document.addEventListener('DOMContentLoaded', () => {
  const imgs = document.querySelectorAll('.menu-card-img img, .about-img, .hero-bg-img, .book-img');
  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => img.style.opacity = '1');
      img.addEventListener('error', () => { img.style.opacity = '0.3'; });
    }
  });
});