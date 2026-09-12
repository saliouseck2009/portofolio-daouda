/* =============================================================
   CEG – Cayor Électricité Générale
   Interactions du site (vanilla JS, aucune dépendance)
   ============================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Header : ombre au scroll ---------- */
  var header = $('#site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var nav = $('#nav');
  var toggle = $('#nav-toggle');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  $$('a', nav).forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992 && nav.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Lien actif selon la section visible ---------- */
  var navLinks = $$('.nav__link');
  var sections = navLinks
    .map(function (l) { return $(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
    });
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Apparition au scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Galerie ---------- */
  var gallery = $('#gallery');
  var moreBtn = $('#gallery-more');
  var photos = [];

  // Photos web (PNG lourds convertis en JPEG optimisés) puis photos JPEG d'origine.
  [19, 20, 21, 22, 23, 24, 25, 26].forEach(function (n) {
    photos.push({ src: 'images/gallerie/web/' + n + '.jpg', alt: 'Équipe CEG sur chantier – photo ' + n });
  });
  for (var i = 29; i <= 50; i++) {
    photos.push({ src: 'images/gallerie/jpeg_file/' + i + '.jpeg', alt: 'Intervention CEG – photo ' + i });
  }

  var visibleCount = parseInt(gallery.getAttribute('data-visible'), 10) || 12;
  var expanded = false;

  photos.forEach(function (p, index) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery__item';
    btn.setAttribute('aria-label', 'Agrandir la photo ' + (index + 1));
    btn.dataset.index = index;
    if (index >= visibleCount) btn.hidden = true;

    var img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    btn.appendChild(img);

    btn.addEventListener('click', function () { openLightbox(index); });
    gallery.appendChild(btn);
  });

  moreBtn.addEventListener('click', function () {
    expanded = !expanded;
    $$('.gallery__item', gallery).forEach(function (item, index) {
      item.hidden = !expanded && index >= visibleCount;
    });
    moreBtn.textContent = expanded ? 'Réduire la galerie' : 'Voir toute la galerie';
    if (!expanded) gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = $('#lightbox');
  var lbImg = $('#lightbox-img');
  var lbCaption = $('#lightbox-caption');
  var lbClose = $('.lightbox__close', lightbox);
  var lbPrev = $('.lightbox__nav--prev', lightbox);
  var lbNext = $('.lightbox__nav--next', lightbox);
  var current = 0;
  var lastFocus = null;

  function show(index) {
    current = (index + photos.length) % photos.length;
    lbImg.src = photos[current].src;
    lbImg.alt = photos[current].alt;
    lbCaption.textContent = (current + 1) + ' / ' + photos.length;
  }
  function openLightbox(index) {
    lastFocus = document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { show(current - 1); });
  lbNext.addEventListener('click', function () { show(current + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // Balayage tactile
  var touchX = null;
  lightbox.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx > 0 ? current - 1 : current + 1);
    touchX = null;
  }, { passive: true });

  /* ---------- Formulaire de contact (mailto prérempli) ---------- */
  var form = $('#contact-form');
  var formError = $('#form-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim();
    var email = $('#f-email').value.trim();
    var phone = $('#f-phone').value.trim();
    var subject = $('#f-subject').value;
    var message = $('#f-message').value.trim();

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var valid = name && emailOk && message;

    $('#f-name').classList.toggle('is-invalid', !name);
    $('#f-email').classList.toggle('is-invalid', !emailOk);
    $('#f-message').classList.toggle('is-invalid', !message);
    formError.hidden = !!valid;
    if (!valid) return;

    var body =
      'Nom : ' + name + '\n' +
      'E-mail : ' + email + '\n' +
      (phone ? 'Téléphone : ' + phone + '\n' : '') +
      '\n' + message;

    window.location.href =
      'mailto:cayoreg@gmail.com' +
      '?subject=' + encodeURIComponent('[Site CEG] ' + subject + ' – ' + name) +
      '&body=' + encodeURIComponent(body);
  });

  /* ---------- Année du pied de page ---------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
