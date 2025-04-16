import { Expense } from "@lib/types/models";
import { useEffect, useState } from "react";
import { getEndOfMonth } from "@lib/utils/date";
import { invokeIpc } from "@lib/utils/invoke-ipc";

export const useExpense = (startDate: string) => {
  // state for expenses (note: this will be a per-view data storage, i.e. when I switch views, the data in these states will disappear)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // format date
    const endDate = getEndOfMonth(startDate);

    // This should probably be in a separate file but we rolling with it
    // the separate file should handle error responses so I can handle them
    // properly here
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

  // deleteExpenses
  // updateExpense

  return {
    expenses,
    error,
  };
};
