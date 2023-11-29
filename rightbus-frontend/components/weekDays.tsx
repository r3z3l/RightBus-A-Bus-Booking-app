import { cn } from "@/lib/utils";
import React from "react";

const WeekDays = ({ highlightDays }: any) => {
  const days: Array<string> = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const shouldHighlight = (day: string) => {
    return highlightDays
      .map((d: string) => d.toLowerCase())
      .includes(day.toLowerCase());
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      {days.map((day, index) => (
        <span
          key={index}
          className={cn(
            "mr-1 text-gray-500",
            shouldHighlight(day) ? "font-bold" : "font-normal"
          )}
        >
          {day.charAt(0)}
        </span>
      ))}
    </div>
  );
};

export default WeekDays;
