import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractJSON = (str: string) => {
  const match = str.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("No JSON object found in string");
  return JSON.parse(match[0]);
};

export const isNotCarFound = (result: string) => {
  // Check if the result has the phrase "No car found"
  const noCarFoundRegex = /No car found/i;
  const isNoCarFound = noCarFoundRegex.test(result);
  if (isNoCarFound) {
    return true;
  }
  // If neither phrase is found, return false
  return false;
};
