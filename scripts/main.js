import { renderTable, renderStats, handleFormSubmit, handleSearch, handleSort } from './ui.js';
import { getAll } from './state.js';

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshUI();
  bindEvents();
  initNav();
});

function refreshUI() {
  const all = getAll();
  renderTable(all);
  renderStats(all);
}

function bindEvents() {
  // Form submit
  document.getElementById('add-form')
    .addEventListener('submit', (e) => {
      handleFormSubmit(e);
      refreshUI();
    });

  // Search
  document.getElementById('search-input')
    .addEventListener('input', (e) => {
      const caseInsensitive = !document.getElementById('case-toggle').checked;
      handleSearch(e.target.value, caseInsensitive);
    });

  // Sort
  document.getElementById('sort-field')
    .addEventListener('change', () => {
      handleSort(
        document.getElementById('sort-field').value,
        document.getElementById('sort-direction').value
      );
    });

  document.getElementById('sort-direction')
    .addEventListener('change', () => {
      handleSort(
        document.getElementById('sort-field').value,
        document.getElementById('sort-direction').value
      );
    });

  // Budget cap
  document.getElementById('save-cap')
    .addEventListener('click', () => {
      const cap = document.getElementById('budget-cap').value;
      localStorage.setItem('sft:cap', cap);
      refreshUI();
      alert('Budget cap saved!');
    });

  // Settings
  document.getElementById('save-settings')
    .addEventListener('click', () => {
      localStorage.setItem('sft:currency', document.getElementById('base-currency').value);
      localStorage.setItem('sft:rate-usd', document.getElementById('rate-usd').value);
      localStorage.setItem('sft:rate-eur', document.getElementById('rate-eur').value);
      alert('Settings saved!');
    });

  // Export
  document.getElementById('export-btn')
    .addEventListener('click', exportJSON);
   
  document.getElementById('import-trigger')
  .addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  // Import
  document.getElementById('import-file')
    .addEventListener('change', importJSON);
}

// ── Import / Export ───────────────────────────────────────────
function exportJSON() {
  const data = getAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      console.log('Parsed data:', data);        // ← ADD THIS
      console.log('Is array:', Array.isArray(data)); // ← AND THIS
      if (!Array.isArray(data)) throw new Error('Not an array');
      const valid = data.every(r => r.id && r.description && r.amount && r.category && r.date);
      console.log('Is valid:', valid);           // ← AND THIS
      if (!valid) throw new Error('Invalid record structure');
      localStorage.setItem('sft:transactions', JSON.stringify(data));
      location.reload();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function initNav() {
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('nav a');

  // Show only dashboard on load
  sections.forEach(s => s.style.display = 'none');
  document.getElementById('dashboard').style.display = 'block';

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);

      sections.forEach(s => s.style.display = 'none');
      document.getElementById(targetId).style.display = 'block';

      // Active nav style
      navLinks.forEach(l => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });
}