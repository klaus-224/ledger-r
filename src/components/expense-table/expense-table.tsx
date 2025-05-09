import {
  ColumnDef,
  getCoreRowModel,
  TableOptions,
} from "@tanstack/react-table";
import { Expense } from "@lib/types/models";
import { X } from "lucide-react";
import { DataTable, EditableCell, DateCell } from "@components/data-table";

const ExpenseTable = ({
  data,
  onUpdate,
  onDelete,
  yearMonth,
}: {
  data: Expense[];
  yearMonth: Date;
  onUpdate: (expense: Expense) => Promise<void>;
  onDelete: (id: number) => Promise<Expense | undefined>;
}) => {
  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: (ctx) => <DateCell currentMonthYear={yearMonth} {...ctx} />,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (props) => <EditableCell {...props} />,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (props) => (
        <div className="inline-flex gap-4 items-center">
          <span>$</span>
          <EditableCell {...props} />
        </div>
      ),
    },
    {
      id: "delete",
      header: () => null,
      cell: (props) => (
        <div
          onClick={async () => {
            await onDelete(props.row.original.id);
          }}
          className="cursor-pointer"
        >
          <X />
        </div>
      ),
    },
  ] as ColumnDef<Expense>[];

  const table: TableOptions<Expense> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id.toString(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        const rowToUpdate = data[rowIndex];
        if (!rowToUpdate) return;

        let parsedValue = value;
        if (columnId === "amount" && typeof value === "string") {
          parsedValue = parseFloat(value);
          if (isNaN(parsedValue as number)) {
            console.error("Invalid amount entered");
            return;
          }
        }
        const updatedExpense: Expense = {
          ...rowToUpdate,
          [columnId]: parsedValue,
        };
        onUpdate(updatedExpense);
      },
    },
  };

  return <DataTable tableOptions={table} />;
};
export default ExpenseTable;
