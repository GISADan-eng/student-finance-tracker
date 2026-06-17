import { getAll, addTransaction, updateTransaction, deleteTransaction, generateId } from './state.js';
import { validateDescription, validateAmount, validateDate, validateCategory, validateNoDuplicateWords } from './validators.js';

// ── Render Table ──────────────────────────────────────────────
export function renderTable(data) {
  const tbody = document.querySelector('#records-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No transactions yet.</td></tr>';
    return;
  }

  data.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(t.description)}</td>
      <td>${Number(t.amount).toFixed(2)}</td>
      <td>${escapeHtml(t.category)}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="handleEdit('${t.id}')" aria-label="Edit ${escapeHtml(t.description)}">Edit</button>
        <button onclick="handleDelete('${t.id}')" aria-label="Delete ${escapeHtml(t.description)}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Stats Dashboard ───────────────────────────────────────────
export function renderStats(data) {
  const total = data.length;
  const sum = data.reduce((acc, t) => acc + Number(t.amount), 0);
  const topCategory = getTopCategory(data);
  const cap = Number(localStorage.getItem('sft:cap') || 0);

  setText('stat-total', total);
  setText('stat-sum', sum.toFixed(2));
  setText('stat-top-category', topCategory || 'N/A');

  // Budget cap
  if (cap > 0) {
    const remaining = cap - sum;
    const capEl = document.getElementById('stat-cap');
    if (capEl) {
      capEl.textContent = remaining >= 0
        ? `Budget remaining: ${remaining.toFixed(2)}`
        : `Over budget by: ${Math.abs(remaining).toFixed(2)}`;
      capEl.setAttribute('aria-live', remaining >= 0 ? 'polite' : 'assertive');
    }
  }

  renderTrend(data);
}

// ── 7-Day Trend ───────────────────────────────────────────────
function renderTrend(data) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = last7Days();
  const totals = days.map(day =>
    data.filter(t => t.date === day).reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const max = Math.max(...totals, 1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / days.length - 10;
  totals.forEach((val, i) => {
    const barHeight = (val / max) * (canvas.height - 30);
    const x = i * (barWidth + 10) + 5;
    const y = canvas.height - barHeight - 20;
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '10px system-ui';
    ctx.fillText(days[i].slice(5), x, canvas.height - 5);
  });
}

// ── Form Handling ─────────────────────────────────────────────
export function handleFormSubmit(e) {
  e.preventDefault();
  clearErrors();

  const description = document.getElementById('expense-description').value.trim();
  const amount = document.getElementById('expense-amount').value.trim();
  const category = document.getElementById('expense-category').value.trim();
  const date = document.getElementById('expense-date').value.trim();

  let hasError = false;

  const dv = validateDescription(description);
  if (!dv.valid) { showError('error-description', dv.message); hasError = true; }

  const dupv = validateNoDuplicateWords(description);
  if (!dupv.valid) { showError('error-description', dupv.message); hasError = true; }

  const av = validateAmount(amount);
  if (!av.valid) { showError('error-amount', av.message); hasError = true; }

  const datev = validateDate(date);
  if (!datev.valid) { showError('error-date', datev.message); hasError = true; }

  const cv = validateCategory(category);
  if (!cv.valid) { showError('error-category', cv.message); hasError = true; }

  if (hasError) return;

  const editId = document.getElementById('add-form').dataset.editId;

  if (editId) {
    updateTransaction(editId, { description, amount: Number(amount), category, date });
    delete document.getElementById('add-form').dataset.editId;
    document.querySelector('#add-form button[type="submit"]').textContent = 'Add Transaction';
    announce('Transaction updated successfully');
  } else {
    addTransaction({
      id: generateId(),
      description,
      amount: Number(amount),
      category,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    announce('Transaction added successfully');
  }

  document.getElementById('add-form').reset();
  refreshUI();
}

export function handleEdit(id) {
  const t = getAll().find(t => t.id === id);
  if (!t) return;

  document.getElementById('expense-description').value = t.description;
  document.getElementById('expense-amount').value = t.amount;
  document.getElementById('expense-category').value = t.category;
  document.getElementById('expense-date').value = t.date;

  const form = document.getElementById('add-form');
  form.dataset.editId = id;
  document.querySelector('#add-form button[type="submit"]').textContent = 'Update Transaction';
  document.getElementById('expense-description').focus();
  document.querySelector('#add').scrollIntoView({ behavior: 'smooth' });
}

export function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) return;
  deleteTransaction(id);
  announce('Transaction deleted');
  refreshUI();
}

// ── Search ────────────────────────────────────────────────────
export function handleSearch(query, caseInsensitive = true) {
  const all = getAll();
  if (!query) { renderTable(all); return; }
  try {
    const re = new RegExp(query, caseInsensitive ? 'i' : '');
    const filtered = all.filter(t =>
      re.test(t.description) || re.test(t.category)
    );
    renderTableWithHighlight(filtered, re);
  } catch {
    announce('Invalid search pattern');
  }
}

function renderTableWithHighlight(data, re) {
  const tbody = document.querySelector('#records-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${highlight(escapeHtml(t.description), re)}</td>
      <td>${Number(t.amount).toFixed(2)}</td>
      <td>${highlight(escapeHtml(t.category), re)}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="handleEdit('${t.id}')" aria-label="Edit ${escapeHtml(t.description)}">Edit</button>
        <button onclick="handleDelete('${t.id}')" aria-label="Delete ${escapeHtml(t.description)}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Sort ──────────────────────────────────────────────────────
export function handleSort(field, direction) {
  const data = getAll().sort((a, b) => {
    if (field === 'amount') return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    if (field === 'date') return direction === 'asc'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
    return direction === 'asc'
      ? a.description.localeCompare(b.description)
      : b.description.localeCompare(a.description);
  });
  renderTable(data);
}

// ── Helpers ───────────────────────────────────────────────────
function refreshUI() {
  const all = getAll();
  renderTable(all);
  renderStats(all);
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.style.display = 'block'; }
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

function announce(message) {
  const el = document.getElementById('announcer');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = message; }, 50); }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function highlight(text, re) {
  return text.replace(re, m => `<mark>${m}</mark>`);
}

function getTopCategory(data) {
  const counts = {};
  data.forEach(t => { counts[t.category] = (counts[t.category] || 0) + Number(t.amount); });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

// ── Expose handlers to global scope (for inline onclick) ──────
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;