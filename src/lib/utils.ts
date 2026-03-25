import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatPrice = (price: number, currency: string = 'NGN') => {
  // Validate currency code - if not provided or invalid, use NGN as default
  const validCurrency = currency && typeof currency === 'string' && currency.length === 3
    ? currency.toUpperCase()
    : 'NGN';

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
    }).format(price);
  } catch (error) {
    // If currency is still invalid, fallback to NGN
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  }
};

export const formatNumberWithCommas = (value: string) => {
  if (!value) return "";
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseNumber = (value: string) => {
  if (!value) return "";
  return value.replace(/,/g, "");
};
export const NIGERIAN_PHONE_REGEX = /^(070|080|081|090|091)\d{8}$/;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
