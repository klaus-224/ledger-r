import { DataTable, DateCell, EditableCell } from "@components/data-table";
import { ExpenseForCreate } from "@lib/types/models";
import {
  ColumnDef,
  getCoreRowModel,
  TableOptions,
} from "@tanstack/react-table";

interface TableProps {
  yearMonth: Date;
  data: ExpenseForCreate[] | [];
  onUpdate: (expense: ExpenseForCreate) => Promise<void>;
}

const NewExpenseTable = ({ data, yearMonth, onUpdate }: TableProps) => {
  const columns: ColumnDef<ExpenseForCreate>[] = [
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

  const table: TableOptions<ExpenseForCreate> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  };

  return <DataTable tableOptions={table} />;
};

export default NewExpenseTable;
