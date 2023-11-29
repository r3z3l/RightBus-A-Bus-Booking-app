import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BusCardItem from "./busCardItem";

const BusCards = ({ data, handleBusSelect }: any) => {
  return (
    <ScrollArea className="h-[calc(100vh-18rem)] w-11/12 mx-auto flex items-center gap-3">
      <div className="flex flex-col justify-start items-center space-y-4">
        {data.map((bus: any) => {
          return <BusCardItem data={bus} key={data.id} handleSelect={handleBusSelect} />;
        })}
      </div>
    </ScrollArea>
  );
};

export default BusCards;
