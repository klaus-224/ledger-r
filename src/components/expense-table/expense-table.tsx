import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Expense } from "@lib/types/models";

const expenses: Expense[] = [
  {
    id: BigInt(1),
    date: "2025-04-12",
    category: "Food",
    amount: 85.5,
  },
  {
    id: BigInt(1),
    date: "2025-04-12",
    category: "Food",
    amount: 85.5,
  },
  {
    id: BigInt(1),
    date: "2025-04-12",
    category: "Food",
    amount: 85.5,
  },
  {
    id: BigInt(1),
    date: "2025-04-12",
    category: "Food",
    amount: 85.5,
  },
  {
    id: BigInt(1),
    date: "2025-04-12",
    category: "Food",
    amount: 85.5,
  },
];

const ExpenseTable = () => {
  const [data, setData] = useState(expenses);

  const columnHelper = createColumnHelper<Expense>();

  const columns = [
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
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
    </table>
  );
};
export default ExpenseTable;
