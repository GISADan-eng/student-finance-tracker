# Student Finance Tracker

A responsive, accessible, vanilla HTML/CSS/JS web app that helps students 
log expenses, track budgets, and understand spending patterns.

**Live Demo:** https://gisadan-eng.github.io/student-finance-tracker/  
**GitHub:** https://github.com/GISADan-eng/student-finance-tracker

---

## Theme
Student Finance Tracker — log daily expenses, set a monthly budget cap, 
search and filter transactions, and visualize spending trends.

---

## Features
- Add, edit, and delete transactions (description, amount, category, date)
- Dashboard with total transactions, total spent, top category, 7-day trend chart
- Monthly budget cap with live status (remaining / overage)
- Live regex search with match highlighting
- Sort by date, description, or amount (ascending/descending)
- localStorage persistence — data survives page refresh
- JSON import/export with structure validation
- Currency settings (base currency + USD/EUR manual rates)
- Mobile-first responsive design (360px, 768px, 1024px breakpoints)
- Full keyboard navigation
- ARIA live regions for screen reader announcements
- Single-page navigation (show/hide sections)

---

## Regex Catalog

| Pattern | Purpose | Example match |
|---|---|---|
| `/^\S(?:.*\S)?$/` | Description: no leading/trailing spaces | `"Lunch at cafeteria"`  / `" Lunch"`  |
| `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Amount: positive number, max 2 decimals | `"12.50"`  / `"12.999"`  |
| `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Date: YYYY-MM-DD format | `"2026-06-14"`  / `"14-06-2026"`  |
| `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Category: letters, spaces, hyphens only | `"Text-Books"`  / `"Food2"`  |
| `/\b(\w+)\s+\1\b/i` | Advanced: detect duplicate words (back-reference) | `"the the cafeteria"`  |
| `/\b(\w+)\s+\1\b/i` | Search: live regex with safe compiler | `"(coffee\|tea)"` highlights matches |

---

## Keyboard Map

| Key | Action |
|---|---|
| `Tab` | Move forward between interactive elements |
| `Shift + Tab` | Move backward between interactive elements |
| `Enter` / `Space` | Activate focused button or link |
| `Arrow keys` | Navigate inside dropdowns/select elements |
| `Tab` → Search box | Type regex pattern to filter transactions |
| `Tab` → Edit button | Fill form with transaction data for editing |
| `Tab` → Delete button | Confirm and delete transaction |
| Skip link (first Tab) | Jump directly to main content |

---

## Accessibility Notes
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- All inputs have associated `<label>` elements via `for`/`id` matching
- Skip-to-content link as first focusable element
- Visible focus outlines on all interactive elements (3px solid blue)
- `role="alert"` on error messages — announced immediately by screen readers
- `aria-live="polite"` on announcer div — confirms add/update/delete actions
- `aria-live="assertive"` on budget cap — urgent alert when budget exceeded
- `aria-current="page"` on active nav link
- `aria-label` on Edit/Delete buttons includes transaction description
- `scope="col"` on all table headers
- `<caption>` on records table (visually hidden, screen reader accessible)
- Keyboard-only flow tested: nav → search → table actions → form → settings

---

## File Structure
student-finance-tracker/

├── index.html          # App shell, semantic HTML, all 5 sections

├── tests.html          # Validator assertions (open in browser)

├── seed.json           # 12 sample transactions for import

├── styles/

│   └── main.css        # Mobile-first CSS, Flexbox, 3 breakpoints, animations

└── scripts/

├── main.js         # Entry point, event binding, import/export

├── state.js        # In-memory transactions array, CRUD operations

├── storage.js      # localStorage save/load

├── ui.js           # DOM rendering, form handling, search, sort, stats

├── validators.js   # Regex patterns + validation functions

└── search.js       # (integrated into ui.js)

---

## How to Run Tests
1. Start a local server in the project folder:
```bash
   python3 -m http.server 8080
```
2. Open `http://localhost:8080/tests.html`
3. All validator assertions should show green 

## How to Run the App
1. Same local server as above
2. Open `http://localhost:8080`
3. Or visit the live GitHub Pages URL above

---

## Milestones
- **M1** — Spec, wireframes, data model, a11y plan
- **M2** — Semantic HTML, mobile-first CSS, Flexbox layout, 3 breakpoints
- **M3** — validators.js (5 regex rules incl. back-reference), tests.html
- **M4** — state.js, ui.js, table render, sort, regex search with highlighting
- **M5** — Dashboard stats, 7-day trend chart, budget cap with ARIA live
- **M6** — localStorage persistence, JSON import/export, currency settings
- **M7** — Keyboard audit, animations, README, demo video

---

## Built By
Dan — African Leadership University  
GitHub: [GISADan-eng](https://github.com/GISADan-eng)  
Domain: gisadan.tech