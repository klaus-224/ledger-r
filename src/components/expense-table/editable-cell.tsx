import { Expense } from "@lib/types/models";
import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface EditableCellProps extends CellContext<Expense, unknown> {
  onUpdate: (updatedExpense: Expense) => Promise<void>;
}

export const EditableCell = ({
  getValue,
  row,
  column,
  onUpdate,
}: EditableCellProps) => {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = async () => {
    const finalValue = column.id === "amount" ? parseFloat(value) : value;

    const updatedExpense: Expense = {
      ...row.original,
      [column.id]: finalValue,
    };

    await onUpdate(updatedExpense);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input type="text" value={value} onChange={onChange} onBlur={onBlur} />
  );
};
