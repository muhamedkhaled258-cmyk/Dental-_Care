/* ============================================
   DENTAL CARE – Main JavaScript
   ============================================ */

// ---- State ----
let currentLang = 'en';
let currentBASlide = 0;
const BA_TOTAL = 5;

// ============================================
// 1. INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader after 2s
  const loader = document.getElementById('pageLoader');
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 2000);

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  initNavbar();
  initLanguageSwitcher();
  initHeroImageLoad();
  initBeforeAfterSlider();
  initHamburger();
  initImageLoader();
  initBookingForm();
  initStickyWhatsApp();
});

// ============================================
// 2. NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu
        document.getElementById('navLinks').classList.remove('open');
      }
    });
  });
}

// ============================================
// 3. HAMBURGER MENU
// ============================================
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

// ============================================
// 4. LANGUAGE SWITCHER
// ============================================
function initLanguageSwitcher() {
  const btn = document.getElementById('langToggle');
  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  const html = document.documentElement;
  const body = document.body;

  if (lang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.remove('lang-en');
    body.classList.add('lang-ar');
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    body.classList.remove('lang-ar');
    body.classList.add('lang-en');
  }

  // Update all translatable elements
  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) {
      // Preserve child elements (like <i> icons)
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // handled via placeholder
      } else {
        // Check if element has only text content (no element children besides icons)
        const hasElementChildren = [...el.children].some(c => c.tagName !== 'I');
        if (!hasElementChildren) {
          el.textContent = text;
          // Re-add icon if it was there
        }
      }
    }
  });

  // Handle elements with icons (buttons, nav links, etc.)
  translateWithIcons(lang);

  // Translate placeholders
  translatePlaceholders(lang);

  // Translate select options
  translateSelectOptions(lang);

  // Update page title
  document.title = lang === 'ar'
    ? 'Dental Care – ابتسامتك تبدأ من هنا'
    : 'Dental Care – Your Smile Starts Here';

  // Trigger AOS refresh
  setTimeout(() => AOS.refresh(), 100);
}

function translateWithIcons(lang) {
  // All elements with data-en and data-ar that might have icon children
  const targets = document.querySelectorAll('[data-en][data-ar]');
  targets.forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text === null) return;

    const icon = el.querySelector('i');
    const tagName = el.tagName;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;
    if (tagName === 'OPTION') return; // handled separately

    if (icon) {
      el.innerHTML = '';
      el.appendChild(icon.cloneNode(true));
      el.appendChild(document.createTextNode(' ' + text));
    } else {
      el.textContent = text;
    }
  });

  // Special: translate spans inside buttons that have data-en/data-ar
  document.querySelectorAll('span[data-en][data-ar]').forEach(span => {
    span.textContent = span.getAttribute(`data-${lang}`);
  });
}

function translatePlaceholders(lang) {
  document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(el => {
    const key = lang === 'ar' ? 'data-ar-placeholder' : 'data-en-placeholder';
    el.setAttribute('placeholder', el.getAttribute(key));
  });
}

function translateSelectOptions(lang) {
  document.querySelectorAll('select option[data-en][data-ar]').forEach(opt => {
    opt.textContent = opt.getAttribute(`data-${lang}`);
  });
}

// ============================================
// 5. HERO IMAGE LOAD ANIMATION
// ============================================
function initHeroImageLoad() {
  const img = document.getElementById('heroImg');
  if (!img) return;

  const onLoad = () => {
    img.classList.add('loaded');
  };

  if (img.complete) {
    onLoad();
  } else {
    img.addEventListener('load', onLoad);
  }
}

// ============================================
// 6. IMAGE LOADER (shimmer removal)
// ============================================
function initImageLoader() {
  document.querySelectorAll('img').forEach(img => {
    const onLoad = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad);
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });
}

// ============================================
// 7. BEFORE & AFTER SLIDER
// ============================================
function initBeforeAfterSlider() {
  const slides = document.querySelectorAll('.ba-slide');
  const dotsContainer = document.getElementById('baDots');
  const prevBtn = document.getElementById('baPrev');
  const nextBtn = document.getElementById('baNext');

  if (!slides.length) return;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ba-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentBASlide].classList.remove('active');
    document.querySelectorAll('.ba-dot')[currentBASlide].classList.remove('active');

    currentBASlide = (index + BA_TOTAL) % BA_TOTAL;

    slides[currentBASlide].classList.add('active');
    document.querySelectorAll('.ba-dot')[currentBASlide].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goToSlide(currentBASlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentBASlide + 1));

  // Auto-advance
  let autoTimer = setInterval(() => goToSlide(currentBASlide + 1), 4500);

  document.querySelector('.ba-slider-container').addEventListener('mouseenter', () => clearInterval(autoTimer));
  document.querySelector('.ba-slider-container').addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goToSlide(currentBASlide + 1), 4500);
  });

  // Touch/swipe support
  let touchStartX = 0;
  const slider = document.getElementById('baSlider');
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goToSlide(currentBASlide + 1);
      else goToSlide(currentBASlide - 1);
    }
  });
}

// ============================================
// 8. BOOKING FORM (WhatsApp)
// ============================================
function initBookingForm() {
  // handled by inline onsubmit
}

function submitBooking(e) {
  e.preventDefault();

  const name = document.getElementById('bookName').value.trim();
  const phone = document.getElementById('bookPhone').value.trim();
  const service = document.getElementById('bookService').value;
  const message = document.getElementById('bookMessage').value.trim();

  if (!name || !phone || !service) {
    const msg = currentLang === 'ar'
      ? 'يرجى ملء جميع الحقول المطلوبة.'
      : 'Please fill in all required fields.';
    showToast(msg, 'error');
    return;
  }

  const serviceName = service.split('/')[0].trim();

  const waMessage = currentLang === 'ar'
    ? `مرحبًا! أرغب في حجز موعد في Dental Care.\n\n👤 الاسم: ${name}\n📱 الهاتف: ${phone}\n🦷 الخدمة: ${serviceName}${message ? '\n💬 ملاحظة: ' + message : ''}\n\nشكرًا!`
    : `Hello! I'd like to book an appointment at Dental Care.\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n🦷 Service: ${serviceName}${message ? '\n💬 Note: ' + message : ''}\n\nThank you!`;

  const encodedMsg = encodeURIComponent(waMessage);
  window.open(`https://wa.me/201145715573?text=${encodedMsg}`, '_blank');

  showToast(
    currentLang === 'ar' ? 'جاري تحويلك إلى واتساب...' : 'Redirecting to WhatsApp...',
    'success'
  );
}

// ============================================
// 9. TOAST NOTIFICATION
// ============================================
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notif toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${msg}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '100px',
    right: currentLang === 'ar' ? 'auto' : '20px',
    left: currentLang === 'ar' ? '20px' : 'auto',
    background: type === 'success' ? '#25d366' : '#e53935',
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    zIndex: '99999',
    animation: 'slideUpIn 0.4s ease',
  });

  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `
      @keyframes slideUpIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ============================================
// 10. STICKY WHATSAPP VISIBILITY
// ============================================
function initStickyWhatsApp() {
  const btn = document.getElementById('stickyWA');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 300) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0.85';
    }
    lastScroll = current;
  }, { passive: true });
}

// ============================================
// 11. ACTIVE NAV LINK ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { passive: true });

// Active nav style injection
const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `
  .navbar.scrolled .nav-links a.active-nav {
    color: var(--primary) !important;
    background: var(--primary-light);
  }
`;
document.head.appendChild(navActiveStyle);
