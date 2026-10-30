/* ============================================================
   DDIA Practice — sticky table of contents
   Highlights the current section link while scrolling.
   Used on long chapter pages that have a .toc sidebar.
   ============================================================ */

(function () {
  'use strict';

  var toc = document.querySelector('.toc');
  if (!toc || !('IntersectionObserver' in window)) return;

  var links = toc.querySelectorAll('a[href^="#"]');
  var byId = {};
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    byId[id] = a;
  });

  var targets = [];
  Object.keys(byId).forEach(function (id) {
    var t = document.getElementById(id);
    if (t) targets.push(t);
  });
  if (!targets.length) return;

  function activate(id) {
    links.forEach(function (a) { a.classList.remove('is-active'); });
    if (byId[id]) byId[id].classList.add('is-active');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) activate(en.target.id);
    });
  }, { rootMargin: '-15% 0px -75% 0px' });

  targets.forEach(function (t) { io.observe(t); });
  activate(targets[0].id);
})();
