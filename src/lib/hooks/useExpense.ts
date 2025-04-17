import {
  Expense,
  ExpenseDateFilter,
  ExpenseForCreate,
  ListParams,
} from "@lib/types/models";
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

    const params: ListParams<ExpenseDateFilter> = {
      data: {
        startDate,
        endDate,
      },
    };

    const getExpenses = async () => {
      try {
        const result = await invokeIpc<Expense[]>(
          "get_expenses_by_date",
          params,
        );

        setExpenses(result);
      } catch (e) {
        setError(error);
      }
    };

    getExpenses();
  }, [startDate]);

  // const deleteExpense = async (id: string) => {
  //   const { result, error } = await invokeIpc("delete_expense", { id });
  //   return { result, error };
  // };
  //
  // const updateExpense = async (expense: Expense) => {
  //   const { result, error } = await invokeIpc("update_expense", { ...expense });
  //   return { result, error };
  // };
  //
  // const createExpense = async (expense: ExpenseForCreate) => {
  //   const { result, error } = await invokeIpc("create_expense", { ...expense });
  //   return { result, error };
  // };
  //
  return {
    expenses,
    error,
    // createExpense,
    // deleteExpense,
    // updateExpense,
  };
};
