/* =========================================================
   G K Ooi & Associates — main.js
   Vanilla JS. No libraries. Progressive enhancement.
   ========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setYear();
    initMobileNav();
    initActiveSectionHighlighting();
    initServices();
    initFaqAccordion();
    initReviewsCarousel();
    initBookingForm();
    initCookieAndMap();
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile hamburger nav ---------- */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a link (mobile)
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- Active-section highlighting in nav ---------- */
  function initActiveSectionHighlighting() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      var section = id && document.getElementById(id);
      if (section) { map[id] = link; sections.push(section); }
    });
    if (!sections.length) return;

    function clearActive() {
      links.forEach(function (l) { l.classList.remove('is-active'); });
    }

    if ('IntersectionObserver' in window) {
      var visible = {};
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        // Pick the most-visible section
        var bestId = null, best = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > best) { best = visible[id]; bestId = id; }
        });
        if (bestId && map[bestId]) {
          clearActive();
          map[bestId].classList.add('is-active');
        }
      }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  /* ---------- Services: expandable items ---------- */
  function initServices() {
    var triggers = document.querySelectorAll('.service-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        if (panel) panel.hidden = open;
      });
    });
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  function initFaqAccordion() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('.faq-trigger'));
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        // Close all
        triggers.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });
        // Open this one (unless it was already open -> now closed)
        if (!open) {
          btn.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  /* ---------- Reviews carousel ---------- */
  function initReviewsCarousel() {
    var carousel = document.getElementById('reviewsCarousel');
    var track = document.getElementById('carouselTrack');
    var prev = document.getElementById('prevReview');
    var next = document.getElementById('nextReview');
    var dotsWrap = document.getElementById('carouselDots');
    if (!carousel || !track) return;

    var slides = Array.prototype.slice.call(track.children);
    var count = slides.length;
    var index = 0;
    var timer = null;
    var INTERVAL = 6000;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build dots
    var dots = [];
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i, true); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function update() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) {
        var current = i === index;
        s.setAttribute('aria-hidden', String(!current));
        // prevent off-screen slides from being tab-focusable
        s.querySelectorAll('a, button').forEach(function (el) {
          if (current) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '-1');
        });
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', String(i === index));
      });
    }

    function goTo(i, userInitiated) {
      index = (i + count) % count;
      update();
      if (userInitiated) restart();
    }
    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(nextSlide, INTERVAL);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (next) next.addEventListener('click', function () { nextSlide(); restart(); });
    if (prev) prev.addEventListener('click', function () { prevSlide(); restart(); });

    // Pause on hover / focus within
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Keyboard arrows when carousel has focus
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prevSlide(); restart(); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { nextSlide(); restart(); e.preventDefault(); }
    });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    update();
    start();
  }

  /* ---------- Booking form ---------- */
  function initBookingForm() {
    var form = document.getElementById('bookingForm');
    var status = document.getElementById('formStatus');
    if (!form) return;

    function showError(field, message) {
      var wrap = field.closest('.form-field');
      if (wrap) wrap.classList.add('has-error');
      var err = form.querySelector('.field-error[data-for="' + field.id + '"]');
      if (err) err.textContent = message;
    }
    function clearError(field) {
      var wrap = field.closest('.form-field');
      if (wrap) wrap.classList.remove('has-error');
      var err = form.querySelector('.field-error[data-for="' + field.id + '"]');
      if (err) err.textContent = '';
    }

    // Clear errors as the user types
    form.addEventListener('input', function (e) {
      if (e.target.id) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      var fields = [
        { el: form.elements['name'], msg: 'Please enter your name.' },
        { el: form.elements['email'], msg: 'Please enter a valid email address.' },
        { el: form.elements['phone'], msg: 'Please enter a contact phone number.' },
        { el: form.elements['treatmentType'], msg: 'Please choose NHS or private.' }
      ];

      var firstInvalid = null;
      fields.forEach(function (f) {
        if (!f.el) return;
        clearError(f.el);
        if (!f.el.checkValidity() || !String(f.el.value).trim()) {
          showError(f.el, f.msg);
          if (!firstInvalid) firstInvalid = f.el;
        }
      });

      if (firstInvalid) {
        status.textContent = 'Please check the highlighted fields and try again.';
        status.classList.add('error');
        firstInvalid.focus();
        return;
      }

      // Gather data
      var data = {
        name: form.elements['name'].value.trim(),
        email: form.elements['email'].value.trim(),
        phone: form.elements['phone'].value.trim(),
        datetime: form.elements['datetime'].value,
        treatmentType: form.elements['treatmentType'].value,
        message: form.elements['message'].value.trim()
      };

      // [TO CONFIRM: Formspree endpoint URL] — submits silently to Formspree; no external app opens
      var ENDPOINT = 'https://formspree.io/f/xnjrkaeo';
      var submitBtn = form.querySelector('button[type="submit"]');

      status.textContent = 'Sending your enquiry…';
      status.className = 'form-status';
      if (submitBtn) submitBtn.disabled = true;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) {
          status.textContent = "Thanks — we've received your enquiry and will be in touch shortly.";
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      }).catch(function () {
        status.innerHTML = 'Sorry — something went wrong sending your enquiry. Please try again, or call us on <a href="tel:+442075821668">020 7582 1668</a>.';
        status.className = 'form-status error';
      })['finally'](function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  /* ---------- Cookie consent + Google Map gating ---------- */
  function initCookieAndMap() {
    var STORAGE_KEY = 'gkooi_cookie_consent';
    var banner = document.getElementById('cookieBanner');
    var accept = document.getElementById('cookieAccept');
    var decline = document.getElementById('cookieDecline');
    var placeholder = document.getElementById('mapPlaceholder');
    var mapEmbed = document.getElementById('mapEmbed');
    var loadMapBtn = document.getElementById('loadMapBtn');

    var consent = null;
    try { consent = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    function loadMap() {
      if (!mapEmbed || mapEmbed.dataset.loaded) return;
      var src = mapEmbed.getAttribute('data-map-src');
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = 'Map showing G K Ooi & Associates at 36 Brunel Road, London SE16 6HZ';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      mapEmbed.appendChild(iframe);
      mapEmbed.hidden = false;
      mapEmbed.dataset.loaded = 'true';
      if (placeholder) placeholder.hidden = true;
    }

    function setConsent(value) {
      try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
      if (banner) banner.hidden = true;
      if (value === 'accepted') loadMap();
    }

    // Initial state
    if (consent === 'accepted') {
      if (banner) banner.hidden = true;
      loadMap();
    } else if (consent === 'declined') {
      if (banner) banner.hidden = true;
    } else if (banner) {
      banner.hidden = false; // first visit
    }

    if (accept) accept.addEventListener('click', function () { setConsent('accepted'); });
    if (decline) decline.addEventListener('click', function () { setConsent('declined'); });

    // The placeholder's own button: accept + load directly
    if (loadMapBtn) loadMapBtn.addEventListener('click', function () { setConsent('accepted'); });
  }
})();
