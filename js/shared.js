/* ============================================================
   DDIA Practice — shared helpers
   Progress lives in localStorage under one key. Nothing leaves
   the browser. Progress is tracked per book chapter
   ("chapter1" ... "chapter12").
   ============================================================ */

(function () {
  'use strict';

  var KEY = 'ddia-practice-v1';

  var CHAPTERS = [];
  for (var i = 1; i <= 12; i++) CHAPTERS.push('chapter' + i);

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* private mode / quota — degrade gracefully */
    }
  }

  var DDIA = {
    chapters: CHAPTERS,
    totalChapters: 12,

    load: load,
    save: save,

    /* ---------- chapters ---------- */

    getChapter: function (id) {
      var d = load();
      return (d.chapters && d.chapters[id]) || null;
    },

    setChapter: function (id, patch) {
      var d = load();
      if (!d.chapters) d.chapters = {};
      var prev = d.chapters[id] || {};
      d.chapters[id] = {};
      for (var k in prev) d.chapters[id][k] = prev[k];
      for (var k2 in patch) d.chapters[id][k2] = patch[k2];
      save(d);
    },

    isChapterComplete: function (id) {
      var c = this.getChapter(id);
      return !!(c && c.completed);
    },

    completedCount: function () {
      var c = 0;
      CHAPTERS.forEach(function (id) {
        if (this.isChapterComplete(id)) c++;
      }, this);
      return c;
    },

    /* ---------- flashcards ---------- */

    getFlashcards: function () {
      var d = load();
      return d.flashcards || { known: [], unknown: [] };
    },

    setFlashcards: function (fc) {
      var d = load();
      d.flashcards = fc;
      save(d);
    },

    markCard: function (id, known) {
      var fc = this.getFlashcards();
      fc.known = fc.known.filter(function (x) { return x !== id; });
      fc.unknown = fc.unknown.filter(function (x) { return x !== id; });
      (known ? fc.known : fc.unknown).push(id);
      this.setFlashcards(fc);
    },

    knownCount: function () {
      return this.getFlashcards().known.length;
    }
  };

  window.DDIA = DDIA;

  /* ---------- reading progress bar on chapter pages ---------- */

  var bar = document.getElementById('readingProgress');
  if (bar && document.body.classList.contains('is-lesson')) {
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- scroll reveals (progressive enhancement) ---------- */

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
