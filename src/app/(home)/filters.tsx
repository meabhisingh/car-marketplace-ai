"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { carTypes } from "@/constants/cars";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Filters = () => {
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleCheckChange = (type: string, change: CheckedState) => {
    const newTypes = change
      ? [...activeFilters, type]
      : activeFilters.filter((t) => t !== type);

    setActiveFilters(newTypes);
  };

  useEffect(() => {
    const query = window.location.href.split("?")?.[1];

    const queries = query?.split("&") || [];
    const carTypeQuery = queries.find((q) => q.startsWith("type="));
    const carTypes = carTypeQuery ? carTypeQuery.split("=")[1].split(",") : [];

    setActiveFilters(carTypes.map((t) => t.toUpperCase()));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const query = window.location.href.split("?")?.[1];
      const queries = query?.split("&") || [];

      const newQuery =
        queries.length > 0
          ? queries.map((q) => {
              if (q.startsWith("type=")) {
                return `type=${activeFilters.join(",")}`;
              }
              return q;
            })
          : [`type=${activeFilters.join(",")}`];

      router.push(`?${newQuery.join("&")}`);
    }, 800); // 0.8 second delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeFilters, router]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <h5 className=" font-bold">Car Type</h5>
        <div className="flex flex-col gap-1 p-2">
          {carTypes.map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={i}
                onCheckedChange={(change) => handleCheckChange(i, change)}
                checked={activeFilters.includes(i)}
              />
              <label
                htmlFor={i}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {i}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
