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

// 去掉字符串后面的单位
export const extractNumberFromLengthString = (lengthString: string): number => {
  // 使用正则表达式匹配数字部分
  const match = lengthString.match(/\d+/);

  // 如果匹配到数字，返回数字部分，否则返回 null
  return match ? parseInt(match[0], 10) : 0;
};
