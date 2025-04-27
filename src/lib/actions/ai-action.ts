"use server";

import { aiService } from "../ai";
import { extractJSON, isNotCarFound } from "../utils";

export const findCar = async (carDescription: string) => {
  const result = await aiService.searchAgent(carDescription);

  const notFound = isNotCarFound(result);

  if (notFound) throw new Error("No car found");

  return result;
};

export const autoGenerateCar = async (carName: string) => {
  const response = await aiService.generateCarAgent(carName);
  const parsed = extractJSON(response);

  return parsed;
};
