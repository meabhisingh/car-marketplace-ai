export const carTypes = [
  "SEDAN",
  "SUV",
  "HATCHBACK",
  "COUPE",
  "CONVERTIBLE",
  "PICKUP",
  "VAN",
  "WAGON",
  "CROSSOVER",
  "SPORTS",
] as const;

export const carFuelTypes = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"] as const;

export type CarType = (typeof carTypes)[number];
export type CarFuelType = (typeof carFuelTypes)[number];
