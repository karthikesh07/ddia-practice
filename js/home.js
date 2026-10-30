/* ============================================================
   DDIA Practice — landing page progress wiring
   Fills the terminal panel + per-chapter timeline statuses.
   ============================================================ */

(function () {
  'use strict';
  if (!window.DDIA) return;

  var TITLES = {
    chapter1: 'Reliable, Scalable, Maintainable Applications',
    chapter2: 'Data Models and Query Languages',
    chapter3: 'Storage and Retrieval',
    chapter4: 'Encoding and Evolution',
    chapter5: 'Replication',
    chapter6: 'Partitioning',
    chapter7: 'Transactions',
    chapter8: 'The Trouble with Distributed Systems',
    chapter9: 'Consistency and Consensus',
    chapter10: 'Batch Processing',
    chapter11: 'Stream Processing',
    chapter12: 'The Future of Data Systems'
  };

  var total = window.DDIA.totalChapters;
  var chaptersDone = window.DDIA.completedCount();
  var totalCards = window.FLASHCARDS ? window.FLASHCARDS.length : 25;
  var known = window.DDIA.knownCount();

  function bar(pct) {
    var width = 10; /* blocks per bar */
    var filled = Math.round(pct * width);
    var out = '';
    for (var i = 0; i < width; i++) out += i < filled ? '█' : '░';
    return out;
  }

  /* ---------- terminal panel ---------- */

  function setText(id, text) {
    var e = document.getElementById(id);
    if (e) e.textContent = text;
  }

  setText('term-chapters-val', chaptersDone + ' / ' + total);
  setText('term-chapters-bar', bar(chaptersDone / total));
  setText('term-cards-val', known + ' / ' + totalCards);
  setText('term-cards-bar', bar(known / totalCards));

  var next = null;
  for (var i = 0; i < window.DDIA.chapters.length; i++) {
    var id = window.DDIA.chapters[i];
    if (!window.DDIA.isChapterComplete(id)) { next = id; break; }
  }
  var tnext = document.getElementById('term-next');
  if (tnext) {
    tnext.innerHTML = '';
    if (next) {
      var d = document.createElement('span');
      d.className = 'dim';
      d.textContent = 'next up   ';
      tnext.appendChild(d);
      tnext.appendChild(document.createTextNode('ch ' + next.replace('chapter', '') + ' — ' + TITLES[next]));
    } else {
      tnext.appendChild(document.createTextNode('✓ curriculum complete — time to reread the book'));
    }
  }

  /* ---------- curriculum timeline statuses ---------- */

  document.querySelectorAll('[data-chapter]').forEach(function (node) {
    var id = node.getAttribute('data-chapter');
    var item = node.closest('.tl-item');
    var c = window.DDIA.getChapter(id);

    if (node.hasAttribute('data-soon')) {
      node.textContent = c && c.completed ? '✓ complete (summary)' : 'expansion coming soon';
      if (item && c && c.completed) item.classList.add('is-done');
      return;
    }

    var label;
    if (c && c.completed) {
      label = '✓ complete';
      if (item) item.classList.add('is-done');
      if (c.quiz && typeof c.quiz.correct === 'number') label += ' · quiz ' + c.quiz.correct + '/' + c.quiz.total;
    } else if (c && c.quiz) {
      label = 'in progress · quiz ' + c.quiz.correct + '/' + c.quiz.total;
      if (item) item.classList.add('is-active');
    } else {
      label = 'not started';
    }
    node.textContent = label;

    var score = item && item.querySelector('.tl-score');
    if (score && c && c.quiz) score.textContent = 'quiz ' + c.quiz.correct + '/' + c.quiz.total;
  });
})();
