# DDIA Practice — a study companion for *Designing Data-Intensive Applications*

A free, self-paced practice site for Martin Kleppmann's
**Designing Data-Intensive Applications** (O'Reilly). Twelve chapter-by-chapter
study guides (one page per book chapter), each with an interactive quiz, plus a
218-card flashcard trainer. All progress (quiz scores, completed chapters, known
flashcards) is stored in your browser's `localStorage` — nothing is sent anywhere.

Plain **HTML/CSS/JS only**: no build step, no npm, no frameworks.

## What's inside

```
├── index.html          Landing page + 3-part curriculum map with progress
├── lessons/
│   ├── chapter1.html   Ch 1  · Reliable, Scalable, Maintainable Applications
│   │                        (sticky ToC, Twitter case study, figure recreations)
│   ├── chapter2.html   Ch 2  · Data Models and Query Languages
│   │                        (relational vs document vs graph, CODASYL, Cypher,
│   │                         SPARQL, Datalog — full-depth guide)
│   ├── chapter3.html   Ch 3  · Storage and Retrieval
│   │                        (bash db_set → hash indexes → SSTables/LSM-trees →
│   │                         B-trees → OLTP/OLAP → column stores — full-depth)
│   ├── chapter4.html   Ch 4  · Encoding and Evolution
│   │                        (JSON/Thrift/Protobuf/Avro byte-by-byte, schema
│   │                         evolution, dataflow through DBs/services/messages)
│   ├── chapter5.html   Ch 5  · Replication
│   │                        (leaders/followers, sync vs. async, failover &
│   │                         split brain, replication logs, lag anomalies,
│   │                         multi-leader conflicts, quorums, version vectors)
│   ├── chapter6.html   Ch 6  · Partitioning
│   ├── chapter7.html   Ch 7  · Transactions
│   │                        (ACID, read committed → snapshot isolation/MVCC,
│   │                         lost updates, write skew & phantoms, serial
│   │                         execution, 2PL, SSI — full-depth guide)
│   ├── chapter8.html   Ch 8  · The Trouble with Distributed Systems
│   │                        (partial failure, unreliable networks & timeouts,
│   │                         clock skew & LWW data loss, TrueTime, process
│   │                         pauses, fencing tokens, Byzantine faults,
│   │                         system models — full-depth guide)
│   ├── chapter9.html   Ch 9  · Consistency and Consensus
│   ├── chapter10.html   Ch 10 · Batch Processing
│   ├── chapter11.html   Ch 11 · Stream Processing
│   └── chapter12.html   Ch 12 · The Future of Data Systems
├── flashcards.html     Flashcard trainer (flip / shuffle / known / unknown)
├── css/style.css       Shared design system
├── js/
│   ├── shared.js       Progress store (localStorage) + scroll reveals
│   ├── quiz.js         Quiz engine (multiple choice + short answer)
│   ├── toc.js          Sticky table-of-contents highlighting
   │   ├── cards.js        The 218 flashcards
│   ├── home.js         Landing-page progress wiring
│   └── flashcards.js   Flashcard trainer logic + keyboard shortcuts
├── .nojekyll           Tells GitHub Pages to serve files as-is
└── README.md
```

## Run it locally

Any static file server works. For example:

```bash
cd ddia-practice
python3 -m http.server 8000
# then open http://localhost:8000
```

## Host it on GitHub Pages

1. **Create a repository** on GitHub (e.g. `ddia-practice`) — public if you
   want free Pages on any plan.
2. **Push this folder's contents** to the repo's default branch (usually
   `main`):
   ```bash
   git init
   git add .
   git commit -m "DDIA practice site"
   git branch -M main
   git remote add origin https://github.com/<you>/ddia-practice.git
   git push -u origin main
   ```
3. **Enable Pages**: in the repo on GitHub, go to
   **Settings → Pages → Build and deployment**:
   - *Source*: **Deploy from a branch**
   - *Branch*: **main**, folder **/(root)**
   - Save.
4. Wait a minute or two, then open
   `https://<you>.github.io/ddia-practice/`

### Subpath notes (already handled)

- The site is served from a subpath (`/ddia-practice/`), so **all asset and
  page links are relative** (`css/style.css` from root pages,
  `../css/style.css` from chapter pages). No absolute paths like `/styles.css`
  are used anywhere.
- The `.nojekyll` file disables GitHub's Jekyll processing so all files are
  served exactly as-is.

## How progress works

Everything is stored under the `ddia-practice-v1` key in `localStorage`:
chapter completion flags (`chapter1` … `chapter12`), quiz scores per chapter,
and flashcard known/unknown marks. Clearing your browser data for the site
resets all progress. There is also a **Reset progress** button on the
flashcards page (for cards only).

Note: progress from the old 7-lesson version of this site is not migrated —
the chapter guides cover the same material and more, so the reset is a good
excuse for a refresher.

## Credits

Fan-made study aid for *Designing Data-Intensive Applications* by Martin
Kleppmann (O'Reilly Media). Not affiliated with or endorsed by the author or
publisher — if you find this useful, buy the book.
