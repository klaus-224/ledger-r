import { useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";
import { ExpenseForCreate } from "@lib/types/models";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { Button } from "@components/ui/button";
import { format, parseISO, startOfMonth } from "date-fns";

const DetailedExpense = () => {
  const { yearMonth } = useParams();

  const { expenses, updateExpense, deleteExpense, createExpense } = useExpense(
    `${yearMonth}-01`,
  );

  const handleAddExpense = () => {
    // pick the start date of the current month of expenses
    const today = format(startOfMonth(parseISO(yearMonth!)), "yyyy-MM-dd");

    const expenseForCreate: ExpenseForCreate = {
      date: today,
      category: "",
      amount: 0,
    };

    createExpense(expenseForCreate);
  };

  return (
    <SectionWrapper
      title={format(parseISO(yearMonth!), "MMMM, yyyy")}
      navigateTo="/expenses"
    >
      <div className="px-10">
        <ExpenseTable
          yearMonth={parseISO(yearMonth!)}
          data={expenses}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
        />
        <div className="mt-5 w-full flex justify-end">
          <Button onClick={handleAddExpense}>Add Expense +</Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DetailedExpense;
