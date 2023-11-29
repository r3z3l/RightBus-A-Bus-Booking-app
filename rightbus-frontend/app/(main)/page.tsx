"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import BusCards from "@/components/busCards";
import { Label } from "@/components/ui/label";
import { getCookie } from "@/components/auth-provider";
import { Card } from "@/components/ui/card";
import SeatSelect from "@/components/seat-select";

export default function Home() {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [bus, setBus] = useState(null);
  const [busData, setBusData] = useState(null);
  const router = useRouter();

  const formSchema = z.object({
    src: z.string().min(2),
    destination: z.string().min(2),
    date: z.coerce.date(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      src: "",
      destination: "",
      date: new Date(),
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setBookingDate(values.date)
      const response = await axios.post(
        "http://localhost:3000/buses/search",
        values
      );

      setBusData(response.data);
      // form.reset();
      // router.push("/");
    } catch (error) {
      console.error(error);
    }
  };


  const handleBusSelect = async (data: any) => {
    try {
      setBus(data);
      const token = getCookie("token");
      console.log(data.date)
      // console.log(data.date.toLocaleDateString())
      const response = await axios.get(
        `http://localhost:3000/availability?id=${data.id}&date=${bookingDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBus((prevState: any) => ({
        ...prevState,
        seat_numbers: response.data.seat_number,
      }));
      setOpen(true);
    } catch (error) {
      setOpen(false);
      console.log("ERROR_GETTING_BUS_DETAIL:", error);
    }
  };

  useEffect(() => {
    async function getBusData() {
      const response = await axios.get("http://localhost:3000/getallbuses");
      setBusData(response.data);
    }

    getBusData();
  }, []);
  console.log(busData)

  return (
    <>
      <div className="p-4 sm:p-6 md:py-14 space-y-8 h-[calc(100vh-92px)]">
        <div className="w-11/12 max-w-4xl mx-auto bg-gray-50 rounded-full shadow-2xl shadow-slate-300">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-4"
            >
              <FormField
                control={form.control}
                name="src"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="rounded-l-full border-none p-8 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter source"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 border-r border-l rounded-none p-8 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter destination"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full border-none h-full text-muted-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date("2024-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <Button className="w-full h-full rounded-r-full bg-rose-800 text-lg hover:bg-rose-800/95">
                Search
              </Button>
            </form>
          </Form>
        </div>
        {busData && (
          <BusCards data={busData} handleBusSelect={handleBusSelect} />
        )}
        {!busData && (
          <div className="h-[500px] w-full flex items-center justify-center text-orange-900">
            <p className="text-2xl">No buses found!</p>
          </div>
        )}
      </div>
      {true && <SeatSelect open={open} setOpen={setOpen} bus={bus} />}
    </>
  );
}
