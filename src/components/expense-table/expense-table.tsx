import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Expense } from "@lib/types/models";
import { EditableCell } from "./editable-cell";

const ExpenseTable = ({
  expenses,
  onUpdate,
  onDelete,
  onAdd,
}: {
  expenses: Expense[];
  onUpdate: (expense: Expense) => Promise<void>;
  onDelete: (id: number) => Promise<Expense | undefined>;
  onAdd: () => void;
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
        <div className="inline-flex gap-1">
          <span>$</span>
          <EditableCell onUpdate={onUpdate} {...props} />
        </div>
      ),
    },
    {
      id: "delete",
      header: () => null,
      cell: (props) => (
        <button
          className="button"
          onClick={async () => {
            console.log("Deleting row with id:", props.row.original.id);
            await onDelete(props.row.original.id);
          }}
        >
          Delete
        </button>
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
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
      <tfoot>
        <tr>
          <td colSpan={table.getVisibleLeafColumns().length} className="pt-4">
            <button
              className="button" // Example style
              onClick={onAdd}
            >
              Add Expense +
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
export default ExpenseTable;
