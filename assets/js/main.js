/* Top Save Wholesale — site behaviour */
(function () {
  'use strict';

  /* --- Mobile menu --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    // Close the menu after tapping a link
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Header shadow on scroll --- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Gallery: drop a tile whose image is missing --- */
  // Keeps the section tidy if a file is renamed or removed, rather than
  // leaving an empty broken-image card behind.
  var shots = document.querySelectorAll('.gallery-item img');
  Array.prototype.forEach.call(shots, function (img) {
    var drop = function () {
      var tile = img.closest('.gallery-item');
      if (tile) tile.remove();
    };
    img.addEventListener('error', drop);
    if (img.complete && img.naturalWidth === 0) drop();
  });

  /* --- Footer year --- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
