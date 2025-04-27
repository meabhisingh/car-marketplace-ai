"use client";

import { Button } from "@/components/ui/button";
import { bookmarkCar } from "@/lib/actions/cars-action";
import { HeartIcon, Share2Icon } from "lucide-react";
import { useOptimistic } from "react";
import { toast } from "sonner";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error("Failed to copy text");
  }
};

type Props = {
  savedBy: {
    id: string;
  }[];
  carId: string;
  userId?: string;
};
export const CoverButtons = ({ carId, savedBy, userId }: Props) => {
  const isSavedByMe = savedBy.some((user) => user.id === userId);

  const [isSaved, startTransition] = useOptimistic(
    isSavedByMe,
    (state) => !state
  );

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => copyToClipboard(`${window.location.href}`)}
      >
        <Share2Icon className="h-5 w-5" />
      </Button>
      <form
        action={async () => {
          startTransition(true);
          await bookmarkCar(carId);
        }}
      >
        <Button variant="outline" size="icon">
          {isSaved ? (
            <>
              <HeartIcon className="h-5 w-5 fill-primary " />
            </>
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
};
