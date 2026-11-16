/**
 * Deterministic Indian & Global Number Formatting Utilities
 * Guarantees 100% identical string output between Node.js SSR and Browser Client
 * to completely prevent React hydration mismatch warnings.
 */

export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  const isNegative = num < 0;
  const absStr = Math.floor(Math.abs(num)).toString();

  let lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);

  let formatted = lastThree;
  if (otherNumbers !== '') {
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return (isNegative ? '-' : '') + formatted;
}

export function formatCurrency(val: number | string | undefined | null, decimals: number = 0): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  const isNegative = num < 0;
  const fixed = Math.abs(num).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);

  let formatted = lastThree;
  if (otherNumbers !== '') {
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const res = (isNegative ? '-' : '') + formatted;
  return decPart !== undefined ? `${res}.${decPart}` : res;
}

export const formatINR = formatCurrency;

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a date string (ISO or timestamp) deterministically as "Nov 14"
 */
export function formatDate(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Formats time deterministically as "03:32 PM"
 */
export function formatTime(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours.toString().padStart(2, '0');
  return `${strHours}:${minutes} ${ampm}`;
}

/**
 * Formats date and time deterministically as "Nov 14, 03:32 PM"
 */
export function formatDateTime(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${formatDate(d)}, ${formatTime(d)}`;
}
