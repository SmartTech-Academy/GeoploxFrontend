import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
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
