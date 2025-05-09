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
      cell: (props) => <DateCell currentMonthYear={yearMonth} {...props} />,
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
    // {
    //   id: "delete",
    //   header: () => null,
    //   cell: (props) => (
    //     <div
    //       onClick={async () => {
    //         await onDelete(props.row.original.id);
    //       }}
    //       className="cursor-pointer"
    //     >
    //       <X />
    //     </div>
    //   ),
    // },
  ];

  const table: TableOptions<ExpenseForCreate> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
        const updatedExpense: ExpenseForCreate = {
          ...rowToUpdate,
          [columnId]: parsedValue,
        };
        onUpdate(updatedExpense);
      },
    },
  };

  return <DataTable tableOptions={table} />;
};

export default NewExpenseTable;
