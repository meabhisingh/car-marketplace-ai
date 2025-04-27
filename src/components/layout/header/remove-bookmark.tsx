"use client";

import { bookmarkCar } from "@/lib/actions/cars-action";
import { LucideX } from "lucide-react";
import { useFormStatus } from "react-dom";
export const RemoveBookmark = async ({ carId }: { carId: string }) => {
  return (
    <form
      action={async () => {
        await bookmarkCar(carId);
      }}
    >
      <Button />
    </form>
  );
};

const Button = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-muted"
    >
      {pending ? (
        <span className=" animate-spin border-2 border-b-black border-white rounded-full w-5 h-5 block" />
      ) : (
        <LucideX />
      )}
    </button>
  );
};
