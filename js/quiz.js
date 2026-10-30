/* ============================================================
   DDIA Practice — quiz engine
   Expects: window.QUIZ = { lesson: 'chapterN', questions: [...] }
   Question shapes:
     { q: "...", options: [...], answer: 1, why: "..." }  → multiple choice
     { q: "...", answer: "...", short: true }              → written reveal
   ============================================================ */

(function () {
  'use strict';

  var data = window.QUIZ;
  var mount = document.getElementById('quiz');
  if (!data || !mount || !window.DDIA) return;

  var chapter = String(data.lesson);
  var state = { answered: {}, correct: 0, mcTotal: 0, shortTotal: 0 };
  var resultEl = null;

  data.questions.forEach(function (q) {
    if (q.options) state.mcTotal++;
    else state.shortTotal++;
  });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- previous score chip ---------- */

  var prev = window.DDIA.getChapter(chapter);
  var chipHost = document.getElementById('quiz-last');
  if (chipHost) {
    if (prev && prev.quiz && typeof prev.quiz.correct === 'number') {
      chipHost.textContent = 'last score ' + prev.quiz.correct + '/' + prev.quiz.total;
      chipHost.classList.add('lit');
    } else if (window.DDIA.isChapterComplete(chapter)) {
      chipHost.textContent = 'completed';
      chipHost.classList.add('done');
    }
  }

  /* ---------- render ---------- */

  data.questions.forEach(function (q, qi) {
    var num = String(qi + 1).padStart(2, '0');
    var card = el('section', 'quiz-q');
    var text = el('div', 'q-text');
    text.appendChild(el('span', 'q-n', num));
    var body = el('div', 'q-body');
    var qp = el('p', null, q.q);
    if (q.short) {
      var tag = el('span', 'chip', 'short answer');
      tag.style.marginLeft = '10px';
      tag.style.verticalAlign = 'middle';
      qp.appendChild(tag);
    }
    body.appendChild(qp);
    text.appendChild(body);
    card.appendChild(text);

    if (q.options) {
      var opts = el('div', 'quiz-opts');
      q.options.forEach(function (opt, oi) {
        var btn = el('button', 'quiz-opt');
        btn.type = 'button';
        var key = el('span', 'opt-key', String.fromCharCode(65 + oi));
        var txt = el('span', null, opt);
        btn.appendChild(key);
        btn.appendChild(txt);
        btn.addEventListener('click', function () { answerMC(qi, q, oi, card); });
        opts.appendChild(btn);
      });
      card.appendChild(opts);
    } else {
      var wrap = el('div', 'quiz-short');
      var ta = document.createElement('textarea');
      ta.setAttribute('aria-label', 'Your answer for question ' + (qi + 1));
      ta.placeholder = 'Say it in your own words, then compare…';
      wrap.appendChild(ta);
      var show = el('button', 'btn ghost small', 'Show answer');
      show.type = 'button';
      show.addEventListener('click', function () { revealShort(qi, q, card); });
      wrap.appendChild(show);
      card.appendChild(wrap);
    }

    mount.appendChild(card);
  });

  /* ---------- answering ---------- */

  function answerMC(qi, q, choice, card) {
    if (state.answered[qi]) return;
    var correct = choice === q.answer;
    state.answered[qi] = { correct: correct };
    if (correct) state.correct++;

    var btns = card.querySelectorAll('.quiz-opt');
    btns.forEach(function (b, i) {
      b.disabled = true;
      if (i === q.answer) b.classList.add('is-correct');
      else if (i === choice) b.classList.add('is-wrong');
    });

    var expl = el('div', 'quiz-expl ' + (correct ? 'ok' : 'bad'));
    expl.appendChild(el('span', 'expl-label', correct ? 'Exactly' : 'Not quite — here’s the idea'));
    var whyEl = el('span', null, q.why || q.options[q.answer]);
    expl.appendChild(whyEl);
    card.appendChild(expl);
    maybeFinish();
  }

  function revealShort(qi, q, card) {
    if (state.answered[qi]) return;
    state.answered[qi] = { reviewed: true };
    var btn = card.querySelector('.quiz-short .btn');
    if (btn) btn.remove();
    var expl = el('div', 'quiz-expl');
    expl.appendChild(el('span', 'expl-label', 'Model answer — compare the shape, not the words'));
    var ans = el('span', null, q.answer);
    expl.appendChild(ans);
    card.appendChild(expl);
    maybeFinish();
  }

  function maybeFinish() {
    var done = Object.keys(state.answered).length;
    if (done < data.questions.length || resultEl) return;

    window.DDIA.setChapter(chapter, {
      quiz: { correct: state.correct, total: state.mcTotal }
    });

    var chip = document.getElementById('quiz-last');
    if (chip) {
      chip.textContent = 'score ' + state.correct + '/' + state.mcTotal;
      chip.classList.add('lit');
    }

    resultEl = el('div', 'quiz-result');
    resultEl.appendChild(el('span', 'score', state.correct + '/' + state.mcTotal));
    var msg = state.correct + ' of ' + state.mcTotal + ' multiple-choice right' +
      (state.shortTotal ? ' · ' + state.shortTotal + ' written answer' + (state.shortTotal > 1 ? 's' : '') + ' reviewed' : '') +
      '. Score saved. Revisit the explanations above, then mark the chapter complete.';
    var p = el('p', null, msg);
    resultEl.appendChild(p);
    mount.appendChild(resultEl);
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- mark complete ---------- */

  var mcBtn = document.getElementById('mark-complete');
  if (mcBtn) {
    var paint = function () {
      var done = window.DDIA.isChapterComplete(chapter);
      mcBtn.classList.toggle('is-done', done);
      mcBtn.textContent = done ? '✓ Chapter complete — nicely done' : 'Mark chapter complete';
    };
    mcBtn.addEventListener('click', function () {
      var done = window.DDIA.isChapterComplete(chapter);
      window.DDIA.setChapter(chapter, { completed: !done });
      paint();
    });
    paint();
  }
})();
