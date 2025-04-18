import {
  Expense,
  ExpenseDateFilter,
  ExpenseForCreate,
  ListParams,
  DeleteParams,
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

  const deleteExpense = async (id: number) => {
    const params: DeleteParams = {
      id: id,
    };

    try {
      const result = await invokeIpc<Expense>("delete_expense", params);
      return result;
    } catch (e: any) {
      setError(e);
    }
  };

  const updateExpense = async (expenseToUpdate: Expense) => {
    try {
      // what is happening here???
      const _ = await invokeIpc<number>("update_expense", {
        ...expenseToUpdate,
      });

      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === expenseToUpdate.id) {
          return expenseToUpdate;
        }

        return expense;
      });

      setExpenses(updatedExpenses);
    } catch (e: any) {
      setError(e);
    }
  };

  const createExpense = async (expenseToCreate: ExpenseForCreate) => {
    try {
      const expense = await invokeIpc<Expense>("create_expense", {
        ...expenseToCreate,
      });

      setExpenses((oldExpenses) => [...oldExpenses, expense]);
    } catch (e: any) {
      console.log(e);
      setError(e);
    }
  };

  return {
    expenses,
    error,
    createExpense,
    deleteExpense,
    updateExpense,
  };
};
