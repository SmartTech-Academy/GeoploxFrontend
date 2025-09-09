import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NIGERIAN_PHONE_REGEX = /^(070|080|081|090|091)\d{8}$/;
