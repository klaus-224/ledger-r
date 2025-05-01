import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Expense } from "@lib/types/models";
import { EditableCell } from "./editable-cell";
import { TiDelete } from "react-icons/ti";

// TODO: update styling of delete button and add expense button
const ExpenseTable = ({
  expenses,
  onUpdate,
  onDelete,
}: {
  expenses: Expense[];
  onUpdate: (expense: Expense) => Promise<void>;
  onDelete: (id: number) => Promise<Expense | undefined>;
}) => {
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "date",
      header: "Date",
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
        <div className="inline-flex gap-1 items-center">
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
        >
          <TiDelete className="text-foreground size-5.5 hover:cursor-pointer" />
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
    <div className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${header.index === 3 ? "w-10" : "auto"}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExpenseTable;
