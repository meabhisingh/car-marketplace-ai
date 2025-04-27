"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { scheduleTestDrive } from "@/lib/actions/cars-action";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TestDriveFormProps = {
  carId: string;
};

export default function TestDriveForm({ carId }: TestDriveFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set minimum date to tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  // Set maximum date to 30 days in the future
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Please select a date for your test drive");
      return;
    }

    try {
      setIsSubmitting(true);
      await scheduleTestDrive({
        carId,
        date,
      });

      setIsOpen(false);
      toast.success(`Test drive scheduled successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule test drive. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Schedule Test Drive
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Test Drive</DialogTitle>
          <DialogDescription>Select a date to test drive</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < minDate || date > maxDate || date.getDay() === 0
                    } // Disable Sundays
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || !date}>
            {isSubmitting ? "Scheduling..." : "Schedule Test Drive"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
