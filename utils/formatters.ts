/**
 * Deterministic Indian Number & Compact Currency Formatting Utilities
 * Guarantees 100% identical string output between Node.js SSR and Browser Client
 * to completely prevent React hydration mismatch warnings.
 *
 * Conventions:
 *  - Large values (>= 1,00,000): Indian compact format -> L (Lakh), Cr (Crore)
 *    e.g., 100000 -> 1L, 125000 -> 1.25L, 2500000 -> 25L, 12500000 -> 1.25Cr, 100000000 -> 10Cr
 *  - Smaller values (< 1,00,000): Standard Indian comma-separated format (e.g., 68,450)
 *  - Chart axes / K-compact option: K (Thousand), L (Lakh), Cr (Crore)
 */

function trimTrailingZeros(val: number, maxDecimals: number = 2): string {
  return parseFloat(val.toFixed(maxDecimals)).toString();
}

function formatIndianCommas(intPart: string): string {
  if (intPart.length <= 3) return intPart;
  const lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
}

/**
 * Formats large numbers in clean Indian compact notation (K / L / Cr).
 * By default compacts values >= 1,00,000 (1L+) and keeps smaller values in standard Indian format.
 * Set compactThousands = true (e.g., for chart axes) to also compact >= 1,000 as K.
 */
export function formatIndianCompact(
  val: number | string | undefined | null,
  compactThousands: boolean = false,
  maxDecimals: number = 2
): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs >= 10000000) {
    return `${sign}${trimTrailingZeros(abs / 10000000, maxDecimals)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}${trimTrailingZeros(abs / 100000, maxDecimals)}L`;
  }
  if (compactThousands && abs >= 1000) {
    return `${sign}${trimTrailingZeros(abs / 1000, 1)}K`;
  }

  return `${sign}${formatIndianCommas(Math.floor(abs).toString())}`;
}

/**
 * Formats currency ticks for chart Y-Axes using K / L / Cr (e.g., ₹0, ₹55K, ₹1.1L, ₹1.25Cr)
 */
export function formatAxisCurrency(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || num === 0) return '₹0';
  const sign = num < 0 ? '-' : '';
  return `${sign}₹${formatIndianCompact(Math.abs(num), true, 2)}`;
}

/**
 * Always returns full Indian comma-separated digits (for exact tax line items if explicitly needed)
 */
export function formatExactNumber(
  val: number | string | undefined | null,
  decimals: number = 0
): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  const sign = num < 0 ? '-' : '';
  const fixed = Math.abs(num).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const formatted = formatIndianCommas(intPart);
  return decPart !== undefined ? `${sign}${formatted}.${decPart}` : `${sign}${formatted}`;
}

/**
 * Primary number formatter used across dashboards, cards, tables, reports & statistics.
 * Automatically compacts >= ₹1,00,000 into clean Indian L / Cr notation while keeping smaller numbers exact.
 */
export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  if (Math.abs(num) >= 100000) {
    return formatIndianCompact(num, false, 2);
  }
  return formatExactNumber(num, 0);
}

/**
 * Primary currency formatter used across monetary displays.
 * Automatically compacts >= 1,00,000 into L / Cr and preserves decimals for smaller figures.
 */
export function formatCurrency(
  val: number | string | undefined | null,
  decimals: number = 0
): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  if (Math.abs(num) >= 100000) {
    return formatIndianCompact(num, false, 2);
  }
  return formatExactNumber(num, decimals);
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
