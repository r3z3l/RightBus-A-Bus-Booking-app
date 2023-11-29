"use client";

import { useState, useEffect } from "react";
import { BusFront } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import WeekDays from "./weekDays";

const BusCardItem = ({ data, handleSelect }: any) => {
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    setSelectedData(data);
  }, [data]);

  console.log(data)

  return (
    <Card
      className="grid grid-cols-3 w-[700px] max-w-2xl p-8 gap-6 rounded-xl shadow-lg shadow-slate-300 border cursor-pointer"
      onClick={() => handleSelect(selectedData)}
    >
      <p className="text-muted-foreground w-fit bg-orange-50 p-2 rounded-md h-full">
        15:30 - 08:50
      </p>
      <div className="flex items-center justify-center">
        <WeekDays highlightDays={data?.day_of_working} />
      </div>
      <p className="font-semibold justify-self-end bg-green-50 p-2 rounded-md">
        ₹ 1,500
      </p>
      <h3 className="capitalize text-2xl font-semibold">
        <span className="flex items-center gap-2">
          <BusFront className="text-rose-800/50" />
          {data?.bus_name}
        </span>
      </h3>
      <p className="text-sm flex items-center justify-center capitalize tracking-wide text-gray-500">{`${data?.src} to ${data?.destination}`}</p>
      {data?.availability ? (
        <div className="flex gap-3 items-center">
          <p className="text-muted-foreground justify-self-end bg-sky-50 rounded-md p-2">
            Total seats {data?.totalseats}
          </p>
          <p className="text-muted-foreground justify-self-end bg-green-100 rounded-md p-2">
            Available seats {data?.availability}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground justify-self-end bg-sky-50 rounded-md p-2">
          Total seats {data?.totalseats}
        </p>
      )}
    </Card>
  );
};

export default BusCardItem;
