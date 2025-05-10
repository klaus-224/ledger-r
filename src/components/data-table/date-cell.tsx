import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils/utils";
import { CellContext } from "@tanstack/react-table";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { useState } from "react";

interface DateCellProps extends CellContext<any, unknown> {
  currentMonthYear: Date;
}

export function DateCell({
  table,
  currentMonthYear,
  row,
  column,
  getValue,
}: DateCellProps) {
  const initialDate = parseISO(getValue() as string);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const startDateRange = startOfMonth(currentMonthYear);
  const endDateRange = endOfMonth(currentMonthYear);

  function handleUpdate(day: Date) {
    if (day) {
      setDate(day);
      setOpen(false);
      const formattedDate = format(day, "yyyy-MM-dd");
      // @ts-ignore // TODO type meta properly
      table.options.meta?.updateData?.(row.index, column.id, formattedDate);
    }
  }

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
          onDayClick={(day: Date) => handleUpdate(day)}
          fromDate={startDateRange}
          toDate={endDateRange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
