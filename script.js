/* ================================================================
   Yogesh & Associates — script.js v2.0
   No backend needed:
   - Form handled via Web3Forms (free, no server)
   - Fallback: mailto: link
   - Alternative: WhatsApp, Phone, Email direct links
   ================================================================ */

'use strict';

/* ─────────────────────────────────────
   WEB3FORMS CONFIG
   ▶ Sign up FREE at https://web3forms.com
   ▶ Get your Access Key from dashboard
   ▶ Replace the key below with your own
   ▶ Emails will arrive at: info@Yogeshandassociates.in
───────────────────────────────────── */
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
// To get a key: https://web3forms.com → enter your email → copy the key
// ⚠️ Replace 'YOUR_WEB3FORMS_ACCESS_KEY_HERE' with actual key before going live

/* ─────────────────────────────────────
   DOM Ready helper
───────────────────────────────────── */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(function () {

  /* ── 1. Sticky navbar shadow ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Mobile menu toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !toggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === page || href.startsWith(page.replace('.html', '')))) {
      link.classList.add('active');
    }
  });

  /* ── 4. Counter animation (IntersectionObserver) ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const isDecimal = !Number.isInteger(target);
        const start = performance.now();

        function tick(now) {
          const elapsed = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          const value = eased * target;
          el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
          if (elapsed < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── 5. Scroll reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── 6. Scroll to top button ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 7. Form tabs (on contact page) ── */
  const tabBtns = document.querySelectorAll('.form-tab-btn');
  const tabPanels = document.querySelectorAll('.form-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      const target = document.getElementById(this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ── 8. Form validation ── */
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    const errorEl = group.querySelector('.field-error');
    let valid = true;
    let msg = '';

    if (input.required && !input.value.trim()) {
      valid = false;
      msg = 'This field is required.';
    } else if (input.type === 'email' && input.value.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value.trim())) { valid = false; msg = 'Please enter a valid email address.'; }
    } else if (input.type === 'tel' && input.value.trim()) {
      const cleaned = input.value.replace(/[\s\-+()]/g, '');
      if (!/^\d{8,15}$/.test(cleaned)) { valid = false; msg = 'Please enter a valid phone number.'; }
    } else if (input.minLength && input.value.trim().length < input.minLength) {
      valid = false;
      msg = `Minimum ${input.minLength} characters required.`;
    }

    group.classList.toggle('has-error', !valid);
    if (errorEl) { errorEl.textContent = msg; errorEl.style.display = valid ? 'none' : 'block'; }
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  /* Inline validation on blur */
  document.querySelectorAll('.validated-form input, .validated-form textarea, .validated-form select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group.has-error')) validateField(input);
    });
  });

  /* ── 9. Web3Forms Contact Form Submission ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validate all fields
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      let allValid = true;
      inputs.forEach(inp => { if (!validateField(inp)) allValid = false; });
      if (!allValid) {
        const firstErr = this.querySelector('.form-group.has-error input, .form-group.has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }

      const submitBtn = this.querySelector('.form-submit');
      const alertSuccess = document.getElementById('alertSuccess');
      const alertError   = document.getElementById('alertError');

      // Loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        const formData = new FormData(this);

        // Web3Forms requires access_key
        if (!formData.get('access_key') || formData.get('access_key') === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
          // Fallback: open mailto link if key not configured
          const name    = formData.get('name') || '';
          const email   = formData.get('email') || '';
          const phone   = formData.get('phone') || '';
          const service = formData.get('service') || '';
          const message = formData.get('message') || '';
          const subject = encodeURIComponent(`Enquiry from ${name} – Yogesh & Associates Website`);
          const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
          );
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          // Open mailto as fallback
          window.location.href = `mailto:info@Yogeshandassociates.in?subject=${subject}&body=${body}`;
          return;
        }

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          // Show success
          contactForm.style.display = 'none';
          if (alertSuccess) alertSuccess.classList.add('show');
          // Track event (if GA4 installed)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'Web3Forms' });
          }
        } else {
          throw new Error(result.message || 'Submission failed');
        }

      } catch (err) {
        console.error('Form error:', err);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        if (alertError) {
          alertError.classList.add('show');
          setTimeout(() => alertError.classList.remove('show'), 6000);
        }
      }
    });
  }

  /* ── 10. Reset form ── */
  const resetBtns = document.querySelectorAll('.reset-form-btn');
  resetBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const form = document.getElementById('contactForm');
      if (form) { form.reset(); form.style.display = ''; }
      document.querySelectorAll('.form-alert').forEach(a => a.classList.remove('show'));
    });
  });

  /* ── 11. Services tab bar (services page) ── */
  const serviceTabs = document.querySelectorAll('.tab-link');
  if (serviceTabs.length && 'IntersectionObserver' in window) {
    const sectionIds = Array.from(serviceTabs).map(t => t.getAttribute('href').replace('#', ''));
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          serviceTabs.forEach(t => {
            t.classList.toggle('active-tab', t.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 60}px 0px -40% 0px` });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ── 12. Phone number formatting ── */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function () {
      let v = this.value.replace(/[^\d+\s\-()]/g, '');
      this.value = v;
    });
  });

  /* ── 13. Lazy-load iframes (map) ── */
  document.querySelectorAll('iframe[data-src]').forEach(iframe => {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { iframe.src = iframe.dataset.src; io.disconnect(); }
        });
      }, { rootMargin: '200px' });
      io.observe(iframe);
    } else {
      iframe.src = iframe.dataset.src;
    }
  });

  /* ── 14. Current year in footer ── */
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ── 15. Smooth anchor scroll with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

});
/* ── END ── */
