import { load, save } from './storage.js';

let transactions = load();

export function getAll() {
  return [...transactions];
}

export function addTransaction(record) {
  transactions.push(record);
  save(transactions);
}

export function updateTransaction(id, changes) {
  transactions = transactions.map(t =>
    t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
  );
  save(transactions);
}

export function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save(transactions);
}

export function generateId() {
  return 'txn_' + Date.now();
}