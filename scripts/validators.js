export const PATTERNS = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWords: /\b(\w+)\s+\1\b/i
};
export function validateDescription(value) {
  if (PATTERNS.description.test(value)) {
    return { valid: true };
  } else {
    return { valid: false, message: "Description cannot have leading/trailing spaces or be empty" };
  }
}
export function validateAmount(value) {
  if (PATTERNS.amount.test(value)) {
    return { valid: true };
  } else {
    return { valid: false, message: "Amount must be a positive number with up to 2 decimal places (e.g. 12.50)" };
  }
}
export function validateDate(value) {
  if (PATTERNS.date.test(value)) {
    return { valid: true };
  } else {
    return { valid: false, message: "Date must be in YYYY-MM-DD format (e.g. 2026-06-14)" };
  }
}
export function validateCategory(value) {
  if (PATTERNS.category.test(value)) {
    return { valid: true };
  } else {
    return { valid: false, message: "Category must contain only letters, spaces, or hyphens (e.g. 'Food', 'Text-Books')" };
  }
}
export function validateNoDuplicateWords(value) {
  if (PATTERNS.duplicateWords.test(value)) {
    return { valid: false, message: "Description contains a repeated word — please check for typos" };
  } else {
    return { valid: true };
  }
}
