import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   getAllCars,
//   getCarById,
//   getSellerInfo,
// } from "@/lib/actions/cars-action";
import {
  Calendar,
  Clock,
  Gauge,
  MapPin,
  Shield,
  PenTool as Tool,
} from "lucide-react";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaDoorOpen, FaWrench } from "react-icons/fa";
import { PiEngineFill, PiSeatFill } from "react-icons/pi";
import { CoverButtons } from "./component";
import TestDriveForm from "./test-drive-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  getAllCars,
  getCarById,
  getSellerInfo,
} from "@/lib/actions/cars-action";
import { getMyProfile } from "@/lib/actions/user-action";

export async function generateStaticParams() {
  const cars = await getAllCars();
  return cars.map((car) => ({
    id: car.id.toString(),
  }));
}

type Props = { params: { id?: string } };

export default async function CarPage({ params }: Props) {
  return (
    <div className="container mx-auto py-10">
      <main className="min-h-screen bg-white dark:bg-zinc-900 pb-16">
        {/* Image Gallery */}
        <div className="relative h-[60vh] bg-black">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <Cover params={params} />
          </Suspense>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}

            <Suspense
              fallback={
                <div className="lg:col-span-2">
                  <Skeleton className="h-96 w-full" />
                </div>
              }
            >
              <MainContent params={params} />
            </Suspense>

            {/* Sidebar */}
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <Sidebar params={params} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

const Cover = async ({ params }: Props) => {
  if (!params.id) return notFound();
  const car = await getCarById(params.id);

  if (!car) return notFound();

  const session = await auth();
  const user = await getMyProfile(session?.user?.email);

  return car.images.length > 0 ? (
    <>
      <Image
        src={car.images[0]}
        alt="Car Image"
        fill
        className="object-cover"
      />
      <CoverButtons carId={params.id} userId={user?.id} savedBy={car.savedBy} />
    </>
  ) : (
    <div className="h-full bg-gray-200"></div>
  );
};

const MainContent = async ({ params }: Props) => {
  if (!params.id) return notFound();

  const car = await getCarById(params.id);

  if (!car) return notFound();

  return (
    <div className="lg:col-span-2">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                ${car.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Market price</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-500" />
              <span>{car.mileage} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tool className="h-4 w-4 text-gray-500" />
              <span>{car.fuelType}</span>
            </div>
          </div>

          <ScrollArea>
            <div className="flex gap-2 py-4">
              {car.features.map((feature) => (
                <Badge className="flex-none" key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="mb-8">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">
            Vehicle Details
          </TabsTrigger>
          <TabsTrigger value="features" className="flex-1">
            Features & Specs
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Vehicle History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-600 mb-6">{car.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Performance</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      0-100km/h: {car.specification?.acceleration} seconds
                    </li>
                    <li> Top Speed: {car.specification?.topSpeed} mph</li>
                    <li> Horsepower: {car.specification?.horsepower} hp</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Dimensions</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li> Length: {car.specification?.length} inches</li>
                    <li> Width: {car.specification?.width} inches</li>
                    <li> Height: {car.specification?.height} inches</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          {/* we got - engineCapacity,doors,seats,topSpeed,accelaration,horsePower,torque */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Features & Specs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">Engine</p>
                  <ul className="text-sm  text-muted-foreground   space-y-1">
                    <li className="flex items-center gap-1">
                      <PiEngineFill /> Engine Capacity:{" "}
                      {car.specification?.engineCapacity} cc
                    </li>
                    <li className="flex items-center gap-1">
                      <FaWrench />
                      Torque: {car.specification?.torque} Nm
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Interior</p>
                  <ul className="text-sm  text-muted-foreground space-y-1">
                    <li className="flex items-center gap-1">
                      <PiSeatFill /> Seats: {car.specification?.seats}
                    </li>
                    <li className="flex items-center gap-1">
                      <FaDoorOpen /> Doors: {car.specification?.doors}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <p className="font-semibold">Safety</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Airbags: Yes</li>
                    <li>ABS: Yes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Warranty</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Not Applicable</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <p className="font-semibold">Colors</p>
                  <ul className="text-sm text-gray-600 flex gap-2 items-center">
                    {car.colors.map((color) => (
                      <li
                        className="w-10 h-10 rounded-md"
                        key={color}
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Type</p>
                  <ul className="text-sm text-gray-600 flex gap-2 items-center">
                    <li className="w-10 h-10 rounded-md">{car.type}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Vehicle History</h3>
              <p className="text-gray-600">
                This vehicle has a clean history with no accidents reported.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add content for other tabs */}
      </Tabs>
    </div>
  );
};

const Sidebar = async ({ params }: Props) => {
  if (!params.id) return notFound();

  const seller = await getSellerInfo(params.id);

  if (!seller) return notFound();

  return (
    <div>
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative h-16 w-16">
              <Image
                src={"/default-image.jpg"}
                alt="Dealer"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{seller.name}</h3>
              <p className="text-sm text-gray-500">Verified Dealer</p>
              <div className="flex items-center gap-1 text-sm text-primary">
                <Shield className="h-4 w-4" />
                <span>Premium Seller</span>
              </div>
            </div>
          </div>
          <Link href={`/contact/${seller.carId}`}>
            <Button className="w-full mb-3">Contact Seller</Button>{" "}
          </Link>
          <TestDriveForm carId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
};
