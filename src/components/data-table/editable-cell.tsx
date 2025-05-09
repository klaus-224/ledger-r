import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export function EditableCell({
  table,
  getValue,
  row,
  column,
}: CellContext<any, unknown>) {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    if (value !== String(initialValue ?? "")) {
      // @ts-ignore // TODO type meta properly
      table.options.meta?.updateData?.(row.index, column.id, value);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="py-1.5 pl-1 focus:outline-none focus:ring-1 focus:ring-primary focus:rounded"
    />
  );
}
