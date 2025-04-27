"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { AddCarSchema, contactSellerSchema, ContactSellerSchema } from "../zod";
import { revalidatePath } from "next/cache";
import { CarType, carTypes } from "@/constants/cars";
import { unstable_cache as cache } from "next/cache";

export const generateImage = async (text: string, name: string) => {
  try {
    const encodedText = encodeURIComponent(text);
    const imagePath = `${name}.jpg`;

    const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (!URL_ENDPOINT) throw new Error("URL_ENDPOINT is not defined");

    const url = `${URL_ENDPOINT}/ik-genimg-prompt-${encodedText}/${imagePath}`;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");

    const base64Key = btoa(privateKey + ":");

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Key}`,
      },
    });

    if (!res.ok) throw new Error("Failed to generate image");

    console.log("Image generated successfully");
    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      base64Data: `data:image/jpeg;base64,${base64}`,
      name: imagePath,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
};

export const addNewCar = async (carData: AddCarSchema) => {
  const session = await auth();
  const authUser = session?.user;

  if (!authUser) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      email: authUser.email!,
    },
  });

  if (!user) throw new Error("User not found");

  await prisma.$transaction(async (tx) => {
    const {
      name,
      brand,
      type,
      year,
      mileage,
      colors,
      price,
      description,
      images,
      features,
      location,
      fuelType,
    } = carData;

    const car = await tx.car.create({
      data: {
        name,
        brand,
        type,
        year,
        mileage,
        colors,
        price,
        description,
        images,
        features,
        location,
        fuelType,
        userId: user.id,
      },
    });

    const {
      sellerAddress,
      sellerCity,
      sellerCountry,
      sellerEmail,
      sellerName,
      sellerPhone,
      sellerState,
      sellerWebsite,
      sellerZip,
      sellerImage,
    } = carData;

    await tx.carSeller.create({
      data: {
        address: sellerAddress,
        city: sellerCity,
        country: sellerCountry,
        email: sellerEmail,
        name: sellerName,
        phone: sellerPhone,
        state: sellerState,
        website: sellerWebsite,
        postalCode: sellerZip,
        image: sellerImage,
        carId: car.id,
      },
    });

    const {
      engineCapacity,
      doors,
      seats,
      topSpeed,
      acceleration,
      horsepower,
      torque,
      length,
      width,
      height,
      weight,
    } = carData;

    await tx.carSpecification.create({
      data: {
        engineCapacity,
        doors,
        seats,
        topSpeed,
        acceleration,
        horsepower,
        torque,
        length,
        width,
        height,
        weight,
        carId: car.id,
      },
    });

    return car;
  });

  console.log("Car added successfully");
  revalidatePath("/");
};

export const getAllCars = cache(
  async () => {
    const cars = await prisma.car.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars;
  },
  ["cars"],
  { revalidate: 60 * 60 * 24 }
);

export const getCars = cache(
  async ({ page = 1, type = "all" }: { page?: number; type?: string }) => {
    const limit = 8;
    const offset = (page - 1) * limit;

    const allowedTypes = type
      .split(",")
      .filter(Boolean)
      .map((t) => t.toUpperCase()) as [];

    const isValidType = allowedTypes.some(
      (t) => carTypes.includes(t as CarType) || t === "all"
    );

    const cars = await prisma.car.findMany({
      skip: offset,
      take: limit,
      where: {
        ...(type !== "all" &&
          isValidType && {
            type: { in: allowedTypes },
          }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars;
  },
  [],
  {
    revalidate: 60 * 60 * 24,
  }
);

export const getCarById = cache(
  async (id: string) => {
    const car = await prisma.car.findUnique({
      where: {
        id,
      },
      include: {
        specification: true,
        savedBy: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!car) throw new Error("Car not found");

    return car;
  },
  [],
  {
    revalidate: 60 * 60 * 24,
  }
);

export const getSellerInfo = cache(
  async (carId: string) => {
    const seller = await prisma.carSeller.findUnique({
      where: {
        carId,
      },
    });

    return seller;
  },
  [],
  { revalidate: 60 * 60 * 24 }
);

export const scheduleTestDrive = async ({
  carId,
  date,
}: {
  carId: string;
  date: Date;
}) => {
  const session = await auth();
  const authUser = session?.user;

  if (!authUser) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      email: authUser.email!,
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!carId) throw new Error("Car ID is required");

  const car = await prisma.car.findUnique({
    where: {
      id: carId,
    },
    select: {
      id: true,
    },
  });

  if (!car) throw new Error("Car not found");

  await prisma.testDriveRequest.upsert({
    where: {
      carId_userId: {
        carId: carId,
        userId: user.id,
      },
    },
    create: { carId, userId: user.id, date },
    update: { date },
  });

  revalidatePath(`/cars/${carId}`);
  return { success: true };
};

export const bookmarkCar = async (carId: string) => {
  const session = await auth();
  const authUser = session?.user;

  if (!authUser) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      email: authUser.email!,
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!carId) throw new Error("Car ID is required");

  const car = await prisma.car.findUnique({
    where: {
      id: carId,
    },
    select: {
      id: true,
      savedBy: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!car) throw new Error("Car not found");

  const isAlreadySaved = car.savedBy.some((item) => item.id === user.id);
  console.log("Car saved by", isAlreadySaved);

  if (isAlreadySaved) {
    await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        savedBy: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
  } else {
    await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        savedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  revalidatePath(`/cars/${carId}`);
};

export const contactSeller = async (data: ContactSellerSchema) => {
  contactSellerSchema.parse(data);

  const { carId, firstName, lastName, content, email, phone } = data;

  const session = await auth();
  const authUser = session?.user;

  if (!authUser) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: {
      email: authUser.email!,
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!carId) throw new Error("Car ID is required");

  const car = await prisma.car.findUnique({
    where: {
      id: carId,
    },
    select: {
      id: true,
    },
  });

  if (!car) throw new Error("Car not found");

  await prisma.message.create({
    data: {
      firstName,
      lastName,
      content,
      email,
      phone,
      userId: user.id,
    },
  });
};
