import NewExpenseTable from "@components/new-expenses-table";
import { Button } from "@components/ui/button";
import { MonthPicker } from "@components/ui/month-picker";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { ExpenseForCreate } from "@lib/types/models";
import { format } from "date-fns";
import { useState } from "react";

const NewExpense = () => {
  const [expenses, setExpenses] = useState<ExpenseForCreate[] | []>([]);
  const [date, setDate] = useState<Date>(new Date());

  const handleAddExpense = () => {
    const newExpense: ExpenseForCreate = {
      date: format(date, "yyyy-MM-dd"),
      category: "",
      amount: 0,
    };

    setExpenses((oldExpenses) => [...oldExpenses, newExpense]);
  };

  return (
    <SectionWrapper title={"New Expenses"} navigateTo="/expenses">
      <div className="flex flex-row items-center justify-end gap-4 mb-10">
        <MonthPicker value={date} onChange={setDate} />
        <Button>Save</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
      <NewExpenseTable data={expenses} />

      <div className="mt-5 w-full flex justify-end">
        <Button onClick={handleAddExpense}>Add Expense +</Button>
      </div>
    </SectionWrapper>
  );
};

export default NewExpense;
