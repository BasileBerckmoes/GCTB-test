# PRD — DOO Psychotechnische Tests Training App

## 1. Overview

A self-hosted web application that faithfully reproduces the five psychotechnical tests from the Belgian Defence **Dienst voor Onthaal en Oriëntatie (DOO)** intake assessment. The app generates randomized questions, enforces real test mechanics (sequential screens, time pressure, no aids), tracks scores, and persists a local scoreboard.

The target user wants to train speed and accuracy under realistic conditions before attending DOO.

### Question Pool Requirement

Every test must support **at least 150 unique questions** so that repeated practice sessions feel fresh. The strategy per test:

| Test | Generation Strategy | Unique Questions |
|---|---|---|
| Getalvaardigheidstest | **Fully random** — infinite arithmetic expression combos | ∞ (algorithmic) |
| Plaatsbepalingstest | **Fully random** — 2 colors × 4 directions × 2 positions = combinatorial | ∞ (algorithmic, capped by 256 unique rule combos) |
| Woordgeheugentest | **Fully random** from word bank — 11 categories × 10+ words × 3 slots | ∞ (algorithmic, but word bank must have ≥15 words per category to avoid repetition feel) |
| Redeneertest | **Fully random** — 6 dimensions × 6 themes × C(8,3) noun picks × statement permutations | ∞ (algorithmic) |
| Foutdetectietest | **Fully random** — generated strings + random substitutions | ∞ (algorithmic) |

All five tests can be generated algorithmically with effectively infinite variety. However, the word banks (Woordgeheugentest) and noun pools (Redeneertest) must be large enough to prevent repetition fatigue. **Minimum: 15 words per category** for Woordgeheugentest and **10 nouns per theme** for Redeneertest. If any generator cannot produce 150+ distinct questions due to combinatorial limits, it must be supplemented with a pre-built question pool.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | **React 18** + **TypeScript** + **Vite** | Fast dev loop, type safety, modern tooling |
| Styling | **Tailwind CSS** | Rapid UI, easy dark/military-style theming |
| State | React Context + `localStorage` | Simple, no backend needed for scores |
| Containerization | **Docker** + **Docker Compose** | Single `docker compose up`, Traefik-ready |
| Web server (prod) | **Nginx** (Alpine) | Lightweight static file serving |
| Testing | **Vitest** + **React Testing Library** | Fast unit/integration tests, Vite-native |

**No backend required** — all question generation and scoring happens client-side in the browser.

---

## 3. User Flow

```
Landing Page
  ├── Start Full Test (all 5 tests sequentially)
  ├── Practice Individual Test (pick one)
  └── Scoreboard
```

### 3.1 Full Test Mode
1. User clicks **Start Full Test**
2. Tests run in fixed order (same as DOO):
   1. Getalvaardigheidstest
   2. Plaatsbepalingstest
   3. Woordgeheugentest
   4. Redeneertest
   5. Foutdetectietest
3. Each test: 25 questions, timed per-question and total
4. After all 5 tests → **Results screen** with per-test breakdown
5. Score saved to scoreboard

### 3.2 Practice Mode
- Pick any single test
- Same 25-question format
- Score shown at end, saved separately on scoreboard

### 3.3 Scoreboard
- Persisted in `localStorage`
- Shows: date/time, mode (full/practice), per-test scores (correct / 25), total time per test, overall score
- Option to clear history

---

## 4. Test Specifications

### 4.1 Getalvaardigheidstest (Numerical Ability)

**Goal:** Measure speed and accuracy of mental arithmetic + comparison.

**Mechanic — 3 sequential screens:**

| Screen | Content | User action |
|---|---|---|
| **Screen 1** | Shows **BOVENSTE LIJN** (top line): one arithmetic expression (e.g. `3 × 7`) | User mentally calculates, memorizes result. Clicks "Volgende" (Next). |
| **Screen 2** | Shows **ONDERSTE LIJN** (bottom line): one arithmetic expression (e.g. `19 − 1`) | User mentally calculates, memorizes result. Clicks "Volgende". |
| **Screen 3** | Shows `B  O  G` buttons | User selects: **B** (Bovenste is groter), **O** (Onderste is groter), **G** (Gelijk). Auto-advances to next question. |

**Question generation rules:**
- Operations: `+`, `−`, `×`, `÷`
- Operands: integers, results always positive integers (no decimals, no negatives)
- Division must be exact (no remainder)
- Result range: 1–200
- Distribution: roughly ⅓ B, ⅓ O, ⅓ G answers across 25 questions
- For G answers: generate one expression, then create an equivalent expression with different operands/operators
- Difficulty: mix of simple (single operation, small numbers) and harder (larger numbers, division)

**Scoring:** 1 point per correct answer. Total time recorded.

---

### 4.2 Plaatsbepalingstest (Position Determination)

**Goal:** Measure ability to mentally visualize arrow figures based on rules.

**Concept — Arrows have 3 properties:**
1. **Color:** Zwart (black) or Wit (white) → displayed as filled vs outlined arrow
2. **Horizontal direction:** Links (left) or Rechts (right) → where the arrow points horizontally
3. **Vertical orientation:** Op (up) or Neer (down) → where the arrow points vertically

**Pijlpunten (arrowheads) indicate direction.** The four combinations:
- Rechts Op: arrow pointing ↗
- Links Op: arrow pointing ↖
- Rechts Neer: arrow pointing ↘
- Links Neer: arrow pointing ↙

Each arrow is either filled (Zwart) or outlined (Wit).

**Mechanic — 2 sequential screens:**

| Screen | Content | User action |
|---|---|---|
| **Screen 1** | Two rules displayed. Each rule is formatted as: `[Color1] BOVEN [Color2]` and `[Direction1] BOVEN [Direction2]`. Example: "Zwart BOVEN Wit" + "Rechts Op BOVEN Rechts Op" | User memorizes both rules. Clicks "Volgende". |
| **Screen 2** | A **3×2 grid** (3 columns, 2 rows) of arrow-pair cells. Each cell contains **two arrows** stacked vertically (top arrow BOVEN bottom arrow). | User clicks the cell where the arrow pair matches BOTH rules simultaneously. |

**Rule interpretation:**
- "Zwart BOVEN Wit" means: top arrow is black, bottom arrow is white
- "Rechts Op BOVEN Links Neer" means: top arrow points right-up, bottom arrow points left-down

**Question generation rules:**
- Randomly generate 2 rules (color rule + direction rule)
- Generate exactly 1 correct cell that satisfies both rules
- Generate 5 distractor cells that each violate at least one rule (but may satisfy one rule — making it tricky)
- Shuffle cell positions randomly in the 3×2 grid

**Arrow rendering:** Use SVG arrows. Filled (black fill) vs outlined (stroke only, white/transparent fill). Arrow direction determined by rotation.

**Scoring:** 1 point per correct answer. Total time recorded.

---

### 4.3 Woordgeheugentest (Word Memory)

**Goal:** Measure short-term memory for word categories and speed of categorization.

**Mechanic — 2 sequential screens:**

| Screen | Content | User action |
|---|---|---|
| **Screen 1** | Three **category rules** displayed in a row (e.g. `Werktuig  |  Vis  |  Werktuig`). | User memorizes the 3 rules in order. Clicks "Volgende". |
| **Screen 2** | Three **words** displayed (e.g. `Nijptang  |  Heilbot  |  Sardine`) + answer options `[0] [1] [2] [3]`. | User counts how many words match their corresponding rule (in order). Clicks the correct count. |

**Category pool and word bank:**

| Category (Dutch) | English | Example words |
|---|---|---|
| Werktuig | Tool | Nijptang, Moersleutel, Hamer, Zaag, Tang, Schroevendraaier, Beitel, Boor, Vijl, Dissel |
| Boom | Tree | Eik, Berk, Den, Beuk, Linde, Wilg, Esdoorn, Populier, Kastanje, Lariks |
| Vloeistof | Liquid | Water, Diesel, Melk, Olie, Sap, Benzine, Azijn, Siroop, Bloed, Inkt |
| Kleren | Clothing | Sok, Jas, Handschoen, Broek, Hemd, Sjaal, Muts, Rok, Vest, Jurk |
| Transport | Transport | Fiets, Koets, Tram, Bus, Trein, Auto, Vliegtuig, Boot, Taxi, Metro |
| Insect | Insect | Kever, Mug, Vlieg, Bij, Wesp, Mier, Krekel, Sprinkhaan, Libel, Mot |
| Vis | Fish | Heilbot, Sardine, Forel, Zalm, Kabeljauw, Haring, Tonijn, Makreel, Snoek, Karper |
| Land | Country | België, India, Engeland, Japan, Brazilië, Noorwegen, Peru, Egypte, Canada, Australië |
| Gebouw | Building | Kerk, School, Fabriek, Ziekenhuis, Brug, Toren, Kasteel, Schuur, Station, Museum |
| Vogel | Bird | Meeuw, Arend, Duif, Uil, Raaf, Specht, Zwaluw, Ekster, Valk, Pelikaan |
| Metaal | Metal | Brons, Goud, Zilver, Koper, IJzer, Staal, Tin, Lood, Platina, Aluminium |

**Question generation rules:**
- Pick 3 random categories as the rules (repeats allowed, as in the real test)
- For each position: with ~60% probability pick a word from the matching category (match), otherwise pick a word from a different category (mismatch)
- Ensure a good distribution of answers 0–3 across 25 questions
- Never repeat the same word within a single question

**Scoring:** 1 point per correct answer. Total time recorded.

---

### 4.4 Redeneertest (Reasoning / Syllogism)

**Goal:** Measure logical reasoning from comparative statements.

**Mechanic — single screen per question:**

Display:
1. Two comparative statements about 3 items
2. A question asking for the extreme (biggest, smallest, fastest, etc.)
3. Three clickable answer options (the 3 item names)

**Comparison dimensions (Dutch):**

| Dimension | Comparative | Question |
|---|---|---|
| Grootte | groter / kleiner | Wie is de grootste? / kleinste? |
| Snelheid | vlugger / trager | Wat is vlugst? / traagst? |
| Afstand | verder / dichterbij | Wat is verst? / dichtst bij? |
| Hoogte | hoger / lager | Wat is hoogst? / laagst? |
| Gewicht | zwaarder / lichter | Wat is zwaarst? / lichtst? |
| Positie | links / rechts van | Wat is verst naar links? / rechts? |

**Themed noun pools (matching DOO style):**

| Theme | Example nouns |
|---|---|
| Voertuigen | Helikopter, Tram, Veerboot, Truck, Trein, Jeep, Tank, Motorfiets |
| Natuur | Berg, Bos, Meer, Rivier, Vallei, Heuvel, Zee, Woestijn |
| Gebouwen | Brug, Kerk, Boom, Toren, Fort, Kazerne, Bunker, Hangar |
| Militair | Patrouille, Compagnie, Regiment, Bataljon, Peloton, Sectie, Brigade, Divisie |
| Personen | Politieman, Pompier, Piloot, Soldaat, Officier, Sergeant, Korporaal, Generaal |
| Objecten | Helm, Geweer, Bajonet, Rugzak, Kompas, Verrekijker, Granaat, Schild |

**Question generation rules:**
- Pick a random dimension + whether asking for the max or min extreme
- Pick 3 nouns from the same theme
- Create a random valid ordering A > B > C (or any permutation)
- Generate two statements that together establish the full order. The statements can be presented in either direction (e.g., "A groter dan B" or "B kleiner dan A") to add variety
- Mix up the statement order (don't always give the "top" comparison first)
- The correct answer is determined by the question (max → top of ordering, min → bottom)
- The 3 answer options are displayed in a random order

**Scoring:** 1 point per correct answer. Total time recorded.

---

### 4.5 Foutdetectietest (Error Detection)

**Goal:** Measure speed and accuracy in spotting character-level differences.

**Mechanic — single screen per question:**

Display:
1. **Eerste lijn** (first line / original): a string of characters
2. **Tweede lijn** (second line / copy): the same string with 0–4 character substitutions
3. Answer options: `[0] [1] [2] [3] [4]`

User counts the number of differing characters and clicks the answer.

**String format types (randomized):**

| Type | Example |
|---|---|
| URL | `http://www.akebxg.com` |
| Email | `psa052@dhi.com` |
| License plate | `KY 19382` |
| Place + number | `Tristdene 16` |
| Alphanumeric code | `SM 83461` |
| Plate code | `T 146 LBD` |

**Question generation rules:**
- Generate a random original string in one of the formats above
- Pick a random error count: 0, 1, 2, 3, or 4
- Apply that many random single-character substitutions (change one char to a different char of the same type: letter→letter, digit→digit)
- Never substitute the same position twice
- Do not change structural characters (`.`, `@`, `://`, spaces that separate sections)
- Ensure good distribution of answer values 0–4 across 25 questions

**Scoring:** 1 point per correct answer. Total time recorded.

---

## 5. UI / UX Requirements

### 5.1 General
- **Language:** Dutch (all UI text, buttons, instructions)
- **Theme:** Clean, professional, slight military aesthetic (dark greens, grays). Not gamified — this is serious training
- **Responsive:** Works on desktop and tablet (primary use case: laptop)
- **Timer:** Visible per-question timer (counting up) + total test timer displayed prominently
- **Keyboard support:** Number keys and B/O/G keys for quick answering where applicable

### 5.2 Screen Transitions
- For multi-screen tests (Getalvaardigheid, Plaatsbepaling, Woordgeheugen): the "Volgende" button advances to next screen. **Previous screen content must disappear completely** (no peeking back)
- Smooth but instant transitions — no animations that waste time

### 5.3 Progress Indicator
- Show `Vraag X / 25` on each question
- Show running score only AFTER test completion (not during — matches real DOO)

### 5.4 Results Screen
- Per test: correct answers / 25, percentage, total time, average time per question
- Full test mode: aggregate score / 125, overall time
- Big clear pass/fail visual indicator (≥80% = green, 60-79% = orange, <60% = red)

### 5.5 Scoreboard
- Table view: date, mode, per-test scores, total score, total time
- Sortable by date or score
- Clear all / delete individual entries
- Stored in `localStorage` (key: `doo-training-scores`)

---

## 6. Docker Setup

### 6.1 Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 6.2 docker-compose.yml
```yaml
version: "3.8"
services:
  doo-training:
    build: .
    container_name: doo-training
    restart: unless-stopped
    ports:
      - "8080:80"
    labels:
      # Traefik labels — user will customize these
      - "traefik.enable=true"
      - "traefik.http.routers.doo-training.rule=Host(`doo.example.com`)"
      - "traefik.http.routers.doo-training.entrypoints=websecure"
      - "traefik.http.routers.doo-training.tls.certresolver=letsencrypt"
      - "traefik.http.services.doo-training.loadbalancer.server.port=80"
```

### 6.3 nginx.conf
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 7. Project Structure

```
doo-training/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── index.ts              # Shared types (TestResult, Score, etc.)
    ├── context/
    │   └── ScoreContext.tsx       # localStorage score management
    ├── components/
    │   ├── Layout.tsx             # Nav, timer, progress bar
    │   ├── Landing.tsx            # Home screen
    │   ├── Scoreboard.tsx         # Score history table
    │   ├── TestRunner.tsx         # Orchestrates sequential tests
    │   ├── ResultsScreen.tsx      # Post-test results
    │   └── tests/
    │       ├── GetalTest.tsx      # Getalvaardigheidstest UI
    │       ├── PlaatsTest.tsx     # Plaatsbepalingstest UI
    │       ├── WoordTest.tsx      # Woordgeheugentest UI
    │       ├── RedeneerTest.tsx   # Redeneertest UI
    │       └── FoutTest.tsx       # Foutdetectietest UI
    ├── generators/
    │   ├── getal.ts               # Numerical question generator
    │   ├── getal.test.ts          # Getal generator tests
    │   ├── plaats.ts              # Arrow position generator
    │   ├── plaats.test.ts         # Plaats generator tests
    │   ├── woord.ts               # Word memory generator
    │   ├── woord.test.ts          # Woord generator tests
    │   ├── redeneer.ts            # Reasoning question generator
    │   ├── redeneer.test.ts       # Redeneer generator tests
    │   ├── fout.ts                # Error detection generator
    │   └── fout.test.ts           # Fout generator tests
    ├── data/
    │   ├── words.ts               # Word/category banks for Woordgeheugentest (≥15 per category)
    │   └── nouns.ts               # Themed noun pools for Redeneertest (≥10 per theme)
    ├── utils/
    │   ├── timer.ts               # Timer hook
    │   └── storage.ts             # localStorage helpers
    └── __tests__/
        ├── integration.test.tsx   # Full test flow integration tests
        └── scoreboard.test.tsx    # Score persistence tests
```

---

## 8. Acceptance Criteria

1. All 5 tests are playable with 25 randomized questions each
2. Multi-screen tests faithfully simulate the DOO screen flow (memorize → answer)
3. Questions are sufficiently randomized — no two runs are identical
4. Answer distributions are balanced (no test is always "B" or always "3")
5. Timer tracks per-question and per-test time
6. Scoreboard persists across browser sessions
7. Runs in Docker with `docker compose up --build`
8. Traefik labels present and ready for customization
9. All UI text is in Dutch
10. Keyboard shortcuts work for quick input
11. **All generator correctness tests pass** (`npm test` exits 0)
12. **Each generator produces ≥150 unique questions** (verified by uniqueness tests)
13. **Word bank ≥15 words per category**, noun pool ≥10 nouns per theme

---

## 9. Test Suite

All question generators must have automated tests to verify correctness. Tests run via `npm test` (Vitest).

### 9.1 Generator Correctness Tests

**Getalvaardigheidstest (`generators/getal.test.ts`):**
- Generated expressions always evaluate to positive integers
- Division expressions have no remainder
- Results fall within 1–200 range
- The labeled correct answer (B/O/G) matches the actual comparison of computed results
- A batch of 25 questions has roughly balanced B/O/G distribution (each ≥5)
- "G" (equal) questions produce two expressions with genuinely equal results
- No division by zero

**Plaatsbepalingstest (`generators/plaats.test.ts`):**
- Exactly 1 of the 6 grid cells matches both rules
- The other 5 cells each violate at least one rule
- Arrow properties (color, direction, orientation) are internally consistent
- The correct cell index matches the labeled answer
- All 6 cells have distinct arrow-pair configurations (no duplicates in grid)

**Woordgeheugentest (`generators/woord.test.ts`):**
- Every word in the word bank belongs to exactly one category (no ambiguity)
- The labeled correct count (0–3) matches the actual number of word-to-rule matches
- No duplicate words within a single question
- A batch of 25 questions has reasonable answer distribution (each of 0,1,2,3 appears ≥3 times)
- All words used are valid Dutch words from the bank (no undefined/null)
- Word bank has ≥15 words per category

**Redeneertest (`generators/redeneer.test.ts`):**
- The two statements together establish a total ordering of 3 items
- The labeled correct answer matches the true extreme (max or min) of the ordering
- Dutch grammar is correct: comparative + "dan" used properly
- Question text matches the dimension (e.g., "zwaarst" only used with gewicht dimension)
- All 3 answer options are distinct nouns
- Noun pools have ≥10 nouns per theme

**Foutdetectietest (`generators/fout.test.ts`):**
- The number of actual character differences between the two lines matches the labeled answer (0–4)
- Structural characters (`.`, `@`, `://`, spaces) are never modified
- Character substitutions are type-preserving (letter→letter, digit→digit)
- No position is substituted more than once
- A batch of 25 questions has each answer value (0–4) appearing ≥3 times
- Generated strings match one of the defined format types

### 9.2 Uniqueness / Variety Tests

For each generator:
- Generate 150 questions and verify no two are identical (same expressions/words/strings AND same answer)
- Generate 10 batches of 25 and verify answer distributions are balanced within tolerance

### 9.3 Integration Tests

- Full test flow: start test → answer 25 questions → results screen renders with correct score
- Score is saved to localStorage after completing a test
- Scoreboard loads and displays previously saved scores
- Keyboard shortcuts (B/O/G, number keys) register correct answers
- Screen transitions: content from Screen 1 is not visible on Screen 2

### 9.4 Running Tests

Given the project will be containerized, we can run the test suite within an ephemeral Docker container to ensure consistency without relying on local machine dependencies.

```bash
# Run all tests using docker compose (assuming a 'node' or 'test' service exists)
docker compose run --rm node npm test

# Run with coverage
docker compose run --rm node npm run test:coverage

# Run specific generator tests
docker compose run --rm node npm test -- generators/getal.test.ts
```

Tests must pass before a full production Docker build (enforced in CI or pre-build scripts).

---

## 10. Out of Scope (v1)

- User accounts / authentication
- Backend / database
- Real DOO time limits (unknown — user trains at own pace, optimizing for speed)
- Difficulty scaling / adaptive questions
- Mobile-first design (desktop is priority)
- Multiplayer / shared scoreboards
