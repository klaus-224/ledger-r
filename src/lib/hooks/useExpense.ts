import { Expense, ExpenseForCreate } from "@lib/types/models";
import { useEffect, useState } from "react";
import { getEndOfMonth } from "@lib/utils/date";
import { invokeIpc } from "@lib/utils/invoke-ipc";

export const useExpense = (startDate: string) => {
  // state for expenses (note: this will be a per-view data storage, i.e. when I switch views, the data in these states will disappear)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");
  // TODO: implement this
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const endDate = getEndOfMonth(startDate);

    const getExpenses = async () => {
      const { result, error } = await invokeIpc("get_expenses_by_date", {
        start_date: startDate,
        end_date: endDate,
      });

      setExpenses(result);
      setError(error);
    };

    getExpenses();
  }, []);

  const deleteExpense = async (id: string) => {
    const { result, error } = await invokeIpc("delete_expense", { id });
    return { result, error };
  };

  const updateExpense = async (expense: Expense) => {
    const { result, error } = await invokeIpc("update_expense", { ...expense });
    return { result, error };
  };

  const createExpense = async (expense: ExpenseForCreate) => {
    const { result, error } = await invokeIpc("create_expense", { ...expense });
    return { result, error };
  };

  return {
    expenses,
    error,
    createExpense,
    deleteExpense,
    updateExpense,
  };
};
