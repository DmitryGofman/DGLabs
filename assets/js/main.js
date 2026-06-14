/* Gofman Labs — interactions (lightweight, performance-safe) */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');

  /* --- Sticky nav background on scroll --- */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Nav colour switches dark↔light depending on section underneath --- */
  var lightAnchor = document.querySelector('[data-nav-light]');
  if (lightAnchor && nav) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // when the light anchor's top crosses the nav, flip theme
        nav.classList.toggle('on-light', e.boundingClientRect.top <= 72 && e.isIntersecting === false ? true : e.intersectionRatio < 1 && e.boundingClientRect.top < 72);
      });
    }, { rootMargin: '-72px 0px 0px 0px', threshold: [0, 1] });
    navObserver.observe(lightAnchor);

    // simpler robust check on scroll
    window.addEventListener('scroll', function () {
      var rect = lightAnchor.getBoundingClientRect();
      nav.classList.toggle('on-light', rect.top <= 72);
    }, { passive: true });
  }

  /* --- Mobile menu --- */
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* --- Reveal on scroll --- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* --- Footer year --- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* --- Contact form (front-end only demo) --- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Thank you — your message is noted. I will respond personally to ' +
          (form.querySelector('#email').value || 'your address') + '.';
        status.style.color = '#6E6A62';
      }
      form.reset();
    });
  }
})();
