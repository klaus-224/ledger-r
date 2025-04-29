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

export const aprilExpenses: Expense[] = [
  { id: 101, date: "2025-04-01", category: "Groceries", amount: 75.2 },
  { id: 102, date: "2025-04-05", category: "Transport", amount: 15.0 },
  { id: 103, date: "2025-04-10", category: "Dining", amount: 45.5 },
  { id: 104, date: "2025-04-12", category: "Utilities", amount: 120.0 },
  { id: 105, date: "2025-04-15", category: "Entertainment", amount: 60.0 },
  { id: 106, date: "2025-04-20", category: "Health", amount: 30.0 },
  { id: 107, date: "2025-04-22", category: "Rent", amount: 950.0 },
  { id: 108, date: "2025-04-25", category: "Shopping", amount: 100.0 },
  { id: 109, date: "2025-04-28", category: "Subscription", amount: 12.99 },
  { id: 110, date: "2025-04-30", category: "Misc", amount: 20.0 },
];

// TODO: implement this
export const useExpense = (startDate: string) => {
  // state for expenses (note: this will be a per-view data storage, i.e. when I switch views, the data in these states will disappear)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

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
      const newExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(newExpenses);
      return result;
    } catch (e: any) {
      setError(e);
    }
  };

  const updateExpense = async (expenseToUpdate: Expense) => {
    try {
      const updatedExpenseId = await invokeIpc<number>("update_expense", {
        ...expenseToUpdate,
      });

      const updatedExpenses = expenses.map((expense) => {
        if (updatedExpenseId === expenseToUpdate.id) {
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
