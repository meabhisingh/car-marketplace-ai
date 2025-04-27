import { carFuelTypes, carTypes } from "@/constants/cars";
import { z } from "zod";

export const generateImageSchema = z.object({
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  name: z.string().min(3, "File name is required"),
});

export type GenerateImageSchema = z.infer<typeof generateImageSchema>;

export const addCarSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(carTypes),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().int().nonnegative(),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  location: z.string().min(2, "Location is required"),
  fuelType: z.enum(carFuelTypes),

  // Specification details
  engineCapacity: z.coerce.number().positive().optional(),
  doors: z.coerce.number().int().positive().optional(),
  seats: z.coerce.number().int().positive().optional(),
  topSpeed: z.coerce.number().int().positive().optional(),
  acceleration: z.coerce.number().int().positive().optional(),
  horsepower: z.coerce.number().int().positive().optional(),
  torque: z.coerce.number().int().positive().optional(),
  length: z.coerce.number().positive().optional(),
  width: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),

  // Seller details
  sellerName: z.string().min(2, "Seller name must be at least 2 characters"),
  sellerImage: z.string().optional(),
  sellerPhone: z.string().min(5, "Valid phone number required"),
  sellerEmail: z.string().email("Valid email required"),
  sellerAddress: z.string().min(5, "Address is required"),
  sellerCity: z.string().min(2, "City is required"),
  sellerState: z.string().min(2, "State is required"),
  sellerZip: z.string().min(2, "Zip code is required"),
  sellerCountry: z.string().min(2, "Country is required"),
  sellerWebsite: z.string().url("Valid URL required"),
});

export type AddCarSchema = z.infer<typeof addCarSchema>;

export const contactSellerSchema = z.object({
  carId: z.string().nonempty("Car ID is required"),
  content: z.string().nonempty("Message content is required"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  phone: z.string().nonempty("Phone number is required"),
});

export type ContactSellerSchema = z.infer<typeof contactSellerSchema>;
