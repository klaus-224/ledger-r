import {
  Expense,
  ExpenseDateFilter,
  ExpenseForCreate,
  ListParams,
  DeleteParams,
  AppError,
} from "@lib/types/models";
import { useEffect, useState } from "react";
import { checkAppError, getEndOfMonth } from "@lib/utils/utils";
import { invokeIpc } from "@lib/utils/utils";
import { format } from "date-fns";

export const useExpense = (startDate: string) => {
  // state for expenses (note: this will be a per-view data storage, i.e. when I switch views, the data in these states will disappear)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExpenses = async (params: ListParams<ExpenseDateFilter>) => {
      try {
        const result = await invokeIpc<Expense[]>(
          "get_expenses_by_date",
          params,
        );

        setExpenses(result);
        setError("");
      } catch (e: any) {
        console.error("Error fetching expenses:", e);
        if (checkAppError(e)) {
          const appError = e as AppError;
          setError(`${appError.kind}: ${appError.message}`);
        } else if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching expenses.");
        }
      }
    };

    if (startDate !== "") {
      const endDate = getEndOfMonth(startDate);
      const params: ListParams<ExpenseDateFilter> = {
        data: {
          startDate,
          endDate: format(endDate, "yyyy-MM-dd"),
        },
      };
      getExpenses(params);
    }
  }, [startDate]);

  const deleteExpense = async (id: number) => {
    const params: DeleteParams = {
      id: id,
    };

    try {
      const result = await invokeIpc<Expense>("delete_expense", params);
      const newExpenses = expenses.filter((expense) => expense.id !== id);

      setExpenses(newExpenses);
      setError("");

      return result;
    } catch (e: any) {
      console.error(`Failed to delete expense ${id}:`, e);
      if (checkAppError(e)) {
        const appError = e as AppError;
        setError(`${appError.kind}: ${appError.message}`);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while fetching expenses.");
      }
    }
  };

  const updateExpense = async (expenseToUpdate: Expense) => {
    try {
      const updatedExpenseId = await invokeIpc<number>("update_expense", {
        ...expenseToUpdate,
      });

      const updatedExpenses = expenses.map((expense) => {
        if (updatedExpenseId === expense.id) {
          return expenseToUpdate;
        }

        return expense;
      });

      setExpenses(updatedExpenses);
    } catch (e: any) {
      console.error(
        `Failed to update expense: ${JSON.stringify(expenseToUpdate)}:`,
        e,
      );
      if (checkAppError(e)) {
        const appError = e as AppError;
        setError(`${appError.kind}: ${appError.message}`);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while fetching expenses.");
      }
    }
  };

  const createExpense = async (expenseToCreate: ExpenseForCreate) => {
    try {
      const expense = await invokeIpc<Expense>("create_expense", {
        ...expenseToCreate,
      });

      setExpenses((oldExpenses) => [...oldExpenses, expense]);
    } catch (e: any) {
      console.error(
        `Failed to create expense: ${JSON.stringify(expenseToCreate)}:`,
        e,
      );
      if (checkAppError(e)) {
        const appError = e as AppError;
        setError(`${appError.kind}: ${appError.message}`);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while fetching expenses.");
      }
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
