import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 从查询字符串中查找tableId参数
export const getQueryParamsString = (string: string) => {
  const queryString = window.location.search;

  const tableIdParam = new URLSearchParams(queryString).get(string);

  return tableIdParam || null;
};

// 弧度转角度
export const radiansToDegrees = (radians: number) => {
  return radians * (180 / Math.PI);
};
