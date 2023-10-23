import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getQueryParamsString = (string: string) => {
  const queryString = window.location.search;

  // 从查询字符串中查找tableId参数
  const tableIdParam = new URLSearchParams(queryString).get(string);

  return tableIdParam || null;
};
