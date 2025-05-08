import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Expense } from "@lib/types/models";
import { EditableCell } from "./editable-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { X } from "lucide-react";
import DateCell from "./date-cell";

const ExpenseTable = ({
  expenses,
  onUpdate,
  onDelete,
  yearMonth,
}: {
  expenses: Expense[];
  yearMonth: Date;
  onUpdate: (expense: Expense) => Promise<void>;
  onDelete: (id: number) => Promise<Expense | undefined>;
}) => {
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: (props) => (
        <DateCell currentMonthYear={yearMonth} onUpdate={onUpdate} {...props} />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (props) => <EditableCell onUpdate={onUpdate} {...props} />,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (props) => (
        <div className="inline-flex gap-4 items-center">
          <span>$</span>
          <EditableCell onUpdate={onUpdate} {...props} />
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
  ];

  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default ExpenseTable;
