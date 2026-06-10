import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, type: string) {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  
  const formatted = formatter.format(price);
  const suffix = type === 'PER_PLATE' ? '/plate' : type === 'PER_DAY' ? '/day' : '';
  
  return `${formatted}${suffix}`;
}
