import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Expense } from "@lib/types/models";
import { cn } from "@lib/utils/utils";
import { CellContext } from "@tanstack/react-table";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
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

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const startDateRange = startOfMonth(currentMonthYear);
  const endDateRange = endOfMonth(currentMonthYear);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={format(date!, "yyyy-MM-dd")}
          className={cn(
            "py-1.5 pl-1 focus:outline-none rounded cursor-text",
            `${open && "ring-1 ring-primary"}`,
          )}
          readOnly
        />
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
