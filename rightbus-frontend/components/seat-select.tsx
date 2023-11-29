"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from "./auth-provider";

const SeatSelect = ({
  open,
  setOpen,
  bus,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  bus: any;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [busDetails, setBusDetails] = useState(null);

  const formSchema = z.object({
    // busId: z.coerce.number(),
    // routeId: z.coerce.number(),
    // date: z.coerce.date(),
    seat_number: z.enum(
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
      ],
      {
        required_error: "You need to select a seat number.",
      }
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   busId: 0,
      //   routeId: 0,
      //   date: new Date(),
      seat_number: "1",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: any) => {
    try {
      const token = getCookie("token");
      const formData = {
        ...values,
        ...bus,
      };

      const response = await axios.post(
        "http://localhost:3000/book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Ticket Confirmed",
          description: response.data.message,
        });
      }
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Bus booking failed",
      });
    }
  };

  useEffect(() => {
    setBusDetails(bus);
  }, [bus]);

  return (
    <Sheet open={open}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize text-2xl">Book Ticket</SheetTitle>
          <SheetDescription className="capitalize">
            for {bus?.bus_name} bus
          </SheetDescription>
          <div className="grid grid-cols-2 gap-2">
            <SheetDescription className="py-2 px-4 bg-green-50 text-green-800 rounded-full">
              Seats Available ({bus?.seat_numbers?.length})
            </SheetDescription>
            <SheetDescription className="py-2 px-4 bg-gray-50 text-gray-800 rounded-full">
              Total Seats ({bus?.totalseats})
            </SheetDescription>
          </div>
          <div className="w-full bg-sky-50 text-sky-700 px-4 py-2 rounded-md capitalize text-sm text-center">
            {`${bus?.src} to ${bus?.destination}`}
          </div>
          <div className="w-full bg-rose-50 text-rose-700 px-4 py-2 rounded-md capitalize text-sm text-center">
            {busDetails?.date}
          </div>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-[calc(100vh-16rem)] overflow-y-scroll"
          >
            <FormField
              control={form.control}
              name="seat_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Seat Number
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-4 border mt-6 p-4 gap-4 rounded-lg shadow-sm"
                    >
                      {[...Array(busDetails?.totalseats)].map((_, idx) => (
                        <FormItem key={idx + 1}>
                          <FormControl>
                            <RadioGroupItem
                              value={(idx + 1)?.toString()}
                              id={`seat-num-${idx + 1}`}
                              className="peer sr-only"
                              disabled={!bus?.seat_numbers?.includes(idx + 1)}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`seat-num-${idx + 1}`}
                            className="text-center leading-3 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            Seat {idx + 1}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-full mt-4">Book</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default SeatSelect;
