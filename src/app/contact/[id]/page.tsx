import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Image } from "@imagekit/next";
import { ContactSellerForm } from "./form";
import { getCarById, getSellerInfo } from "@/lib/actions/cars-action";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { format } from "date-fns";

type Props = {
  params: {
    id: string;
  };
};
export default function ContactSeller({ params }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={<Loader />}>
          <MainContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}

const Loader = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="h-96 lg:col-span-2" />
      <div className="lg:col-span-1">
        <Skeleton className="h-96" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
        <Skeleton className="h-96 mt-4" />
      </div>
    </div>
  );
};

const MainContent = async ({ params }: Props) => {
  const car = await getCarById(params.id);

  if (!car) {
    return <div className="text-center">Car not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="relative h-20 w-32 flex-shrink-0">
                <Image
                  src={car.images[0]}
                  alt={car.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{car.name}</h2>
                <p className="text-sm text-gray-500">
                  {car.year} • {car.mileage} miles
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  ${car.price.toLocaleString()}
                </p>
              </div>
            </div>
            <ContactSellerForm carId={car.id.toString()} />
          </CardContent>
        </Card>
      </div>

      {/* Dealer Information */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Suspense fallback={<Skeleton className=" h-16 w-16" />}>
              <SellerInfo id={params.id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SellerInfo = async ({ id }: { id: string }) => {
  const seller = await getSellerInfo(id);

  if (!seller) return notFound();

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <Image
            src={seller?.image || "/default-avatar.png"}
            alt="Dealer"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{seller.name}</h3>
          <p className="text-sm text-gray-500">
            Verified Dealer since{" "}
            {format(new Date(seller.createdAt), "MMMM yyyy")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {seller.address} {seller.city}, {seller.state}, {seller.country}{" "}
              {seller.postalCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-500">{seller.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-gray-500">{seller.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Business Hours</p>
            <p className="text-sm text-gray-500">
              Mon - Sat: 9:00 AM - 7:00 PM
            </p>
            <p className="text-sm text-gray-500">Sun: 10:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </>
  );
};
