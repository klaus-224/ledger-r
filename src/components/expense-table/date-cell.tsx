import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Expense } from "@lib/types/models";
import { cn } from "@lib/utils/utils";
import { CellContext } from "@tanstack/react-table";
import {
  endOfMonth,
  format,
  formatDate,
  parseISO,
  startOfMonth,
} from "date-fns";
import { useState } from "react";

interface DateCellProps extends CellContext<Expense, unknown> {
  currentMonthYear: Date;
  onUpdate: (updatedExpense: Expense) => Promise<void>;
}

const DateCell = ({
  currentMonthYear,
  row,
  getValue,
  onUpdate,
}: DateCellProps) => {
  const initialDate = parseISO(getValue() as string);
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const startDateRange = startOfMonth(currentMonthYear);
  const endDateRange = endOfMonth(currentMonthYear);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date && formatDate(date, "yyyy-MM-dd")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onDayClick={(day) => {
            setDate(day);
            onUpdate({ ...row.original, date: format(day, "yyyy-MM-dd") });
          }}
          fromDate={startDateRange}
          toDate={endDateRange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateCell;
