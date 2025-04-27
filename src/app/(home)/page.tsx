import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarIcon, Plus, Search } from "lucide-react";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { Suspense } from "react";
import { Filters } from "./filters";
import { getCars } from "@/lib/actions/cars-action";

type Props = {
  searchParams: { type: string; page: string };
};
export default function Home({ searchParams }: Props) {
  return (
    <main className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/cover.avif"
            alt="Hero car"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center  px-4">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Find Your Perfect Car
          </h1>
          <p className="text-xl mb-8 text-white">
            Browse through thousands of quality vehicles
          </p>

          {/* Search Bar */}
          <div className="bg-white dark:bg-zinc-950 rounded-lg p-4 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by make, model..."
                className="md:col-span-2"
              />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10000">$0 - $10,000</SelectItem>
                  <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                  <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                  <SelectItem value="30000+">$30,000+</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Cars</h2>
          <div className="flex gap-2">
            <Filters />

            <Button asChild>
              <Link href="/cars/add">
                <Plus className="mr-2 h-4 w-4" /> Add Listing
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense
            fallback={<div className="h-48 bg-gray-200 animate-pulse"></div>}
          >
            <FeaturedCars searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CarIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const FeaturedCars = async ({ searchParams }: Props) => {
  const page = Number(searchParams.page) || 1;
  const type = searchParams.type || "all";

  const cars = await getCars({ page, type });

  return cars.map((car) => (
    <Card key={car.id} className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold">{car.name}</h3>
            <p className="text-sm text-gray-500">
              {car.year} • {car.mileage} miles
            </p>
          </div>
          <p className="text-xl font-bold text-primary">
            ${car.price.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button className="w-full" asChild>
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/contact/${car.id}`}>Contact Seller</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  ));
};

const features = [
  {
    title: "Verified Dealers",
    description:
      "All our dealers are thoroughly vetted and verified to ensure quality service",
  },
  {
    title: "Secure Transactions",
    description: "Your purchases are protected with our secure payment system",
  },
  {
    title: "Quality Guarantee",
    description: "Every vehicle undergoes a rigorous inspection process",
  },
];
