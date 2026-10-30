/* ============================================================
   DDIA Practice — flashcard trainer
   Click to flip · prev/next · shuffle · known/unknown marking ·
   unknown-only filter · progress in localStorage.
   Keyboard: ← → navigate · space flip · K known · U unknown · S shuffle
   ============================================================ */

(function () {
  'use strict';
  if (!window.DDIA || !window.FLASHCARDS) return;

  var cards = window.FLASHCARDS;
  var cardEl = document.getElementById('fc-card');
  if (!cardEl) return;

  var frontEl = document.getElementById('fc-front');
  var backEl = document.getElementById('fc-back');
  var counterEl = document.getElementById('fc-counter');
  var knownBadge = document.getElementById('fc-known-badge');
  var barEl = document.getElementById('fc-bar-fill');
  var barLabel = document.getElementById('fc-bar-label');
  var emptyEl = document.getElementById('fc-empty');
  var onlyUnknown = false;
  var order = cards.map(function (c, i) { return i; });
  var pos = 0;

  function state() { return window.DDIA.getFlashcards(); }

  function isKnown(card) {
    return state().known.indexOf(card.id) !== -1;
  }

  function deck() {
    if (!onlyUnknown) return order;
    var s = state();
    return order.filter(function (i) { return s.known.indexOf(cards[i].id) === -1; });
  }

  /* ---------- rendering ---------- */

  function paint() {
    var d = deck();
    if (!d.length) {
      cardEl.style.display = 'none';
      document.getElementById('fc-controls-row').style.display = 'none';
      document.getElementById('fc-actions-row').style.display = 'none';
      document.getElementById('fc-progress').style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }
    if (pos >= d.length) pos = d.length - 1;
    if (pos < 0) pos = 0;

    var card = cards[d[pos]];
    var wasFlipped = cardEl.classList.contains('is-flipped');
    cardEl.classList.remove('is-flipped');
    var swap = function () {
      frontEl.textContent = card.front;
      backEl.textContent = card.back;
    };
    /* if the card is flipping back, let the animation land before swapping text */
    if (wasFlipped) setTimeout(swap, 180); else swap();

    var lessonChip = document.getElementById('fc-lesson');
    if (lessonChip) lessonChip.textContent = card.lesson;

    counterEl.textContent = 'card ' + (pos + 1) + ' / ' + d.length +
      (onlyUnknown ? ' · unknown only' : '');
    if (knownBadge) {
      knownBadge.textContent = isKnown(card) ? '✓ marked known' : 'unmarked';
      knownBadge.className = 'chip ' + (isKnown(card) ? 'done' : '');
    }
    paintProgress();
  }

  function paintProgress() {
    var known = state().known.length;
    var pct = cards.length ? (known / cards.length) * 100 : 0;
    if (barEl) barEl.style.width = pct + '%';
    if (barLabel) {
      barLabel.textContent = known + ' of ' + cards.length + ' cards known';
    }
  }

  /* ---------- actions ---------- */

  function next(dir) {
    var d = deck();
    if (!d.length) return;
    pos = (pos + dir + d.length) % d.length;
    paint();
  }

  function flip() {
    cardEl.classList.toggle('is-flipped');
  }

  function mark(known) {
    var d = deck();
    if (!d.length) return;
    window.DDIA.markCard(cards[d[pos]].id, known);
    if (known) {
      /* slide forward so the fresh known card doesn't block the view */
      if (deck().length && pos >= deck().length) pos = Math.max(0, deck().length - 1);
      next(1);
    } else {
      paint();
    }
  }

  function shuffle() {
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }
    pos = 0;
    paint();
  }

  cardEl.addEventListener('click', flip);

  var bind = function (id, fn) {
    var e = document.getElementById(id);
    if (e) e.addEventListener('click', fn);
  };
  bind('fc-prev', function () { next(-1); });
  bind('fc-flip', flip);
  bind('fc-next', function () { next(1); });
  bind('fc-known', function () { mark(true); });
  bind('fc-unknown', function () { mark(false); });
  bind('fc-shuffle', shuffle);

  bind('fc-only-unknown', function () {
    onlyUnknown = !onlyUnknown;
    this.classList.toggle('on', onlyUnknown);
    this.textContent = onlyUnknown ? '✓ unknown only' : 'unknown only';
    pos = 0;
    paint();
  });

  bind('fc-reset', function () {
    if (!window.confirm('Reset all flashcard progress?')) return;
    window.DDIA.setFlashcards({ known: [], unknown: [] });
    pos = 0;
    paint();
  });

  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    switch (e.key) {
      case 'ArrowLeft': next(-1); break;
      case 'ArrowRight': next(1); break;
      case ' ': case 'Enter': e.preventDefault(); flip(); break;
      case 'k': case 'K': mark(true); break;
      case 'u': case 'U': mark(false); break;
      case 's': case 'S': shuffle(); break;
    }
  });

  paint();
})();
