import NewExpenseTable from "@components/new-expenses-table";
import { Button } from "@components/ui/button";
import { MonthPicker } from "@components/ui/month-picker";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { useExpense } from "@lib/hooks/useExpense";
import { ExpenseForCreate } from "@lib/types/models";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";

const NewExpense = () => {
  const [expenses, setExpenses] = useState<ExpenseForCreate[] | []>([]);
  const [date, setDate] = useState<Date>(new Date());
  const { createExpense } = useExpense("");
  const navigate = useNavigate();

  const handleAddExpense = () => {
    const newExpense: ExpenseForCreate = {
      date: format(date, "yyyy-MM-dd"),
      category: "",
      amount: 0,
    };

    setExpenses((oldExpenses) => [...oldExpenses, newExpense]);
  };

  const handleUpdateExpense = (
    rowIndex: number,
    updatedExpense: ExpenseForCreate,
  ) => {
    const newExpenses = expenses.map((expense, index) => {
      if (index === rowIndex) {
        return {
          ...updatedExpense,
        };
      }
      return expense;
    });

    if (newExpenses.length > 0) {
      setExpenses([...newExpenses]);
    }
  };

  const handleSave = () => {
    expenses.forEach((expense) => {
      createExpense(expense);
    });
    navigate("/expenses");
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  return (
    <SectionWrapper title={"New Expenses"} navigateTo="/expenses">
      <div className="flex flex-row items-center justify-end gap-4 mb-10">
        <MonthPicker value={date} onChange={setDate} />
        <Button onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      <div className="px-10">
        <NewExpenseTable
          data={expenses}
          yearMonth={date}
          onUpdate={handleUpdateExpense}
        />
        <div className="mt-5 w-full flex justify-end">
          <Button onClick={handleAddExpense}>Add Expense +</Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default NewExpense;
