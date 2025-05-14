"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@lib/utils/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  disabled,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);

  const currentDate = new Date(value);
  // Apply year offset for navigation without changing the actual selected date
  const displayDate = new Date(currentDate);
  displayDate.setFullYear(currentDate.getFullYear() + yearOffset);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(monthIndex);
    onChange(newDate);
    setOpen(false);
    // Reset year offset after selection
    setYearOffset(0);
  };

  const handlePreviousYear = () => {
    setYearOffset(yearOffset - 1);
  };

  const handleNextYear = () => {
    setYearOffset(yearOffset + 1);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(value, "MMMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousYear}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous year</span>
            </Button>
            <div className="font-medium">{format(displayDate, "yyyy")}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextYear}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next year</span>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, i) => {
              // Check if this month/year combination matches the selected date
              const isSelected =
                value.getMonth() === i &&
                value.getFullYear() === displayDate.getFullYear();

              return (
                <Button
                  key={month}
                  variant="ghost"
                  className={cn(
                    "h-9 w-full rounded-md p-0 font-normal",
                    isSelected && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => handleMonthSelect(i)}
                >
                  <span className="text-sm">{month.substring(0, 3)}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
