import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";
import dayjs from "dayjs";
import { ExpenseForCreate } from "@lib/types/models";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { formatDate } from "@lib/utils/utils";
import { Button } from "@components/ui/button";

const DetailedExpense = () => {
  const { yearMonth } = useParams();

  const { expenses, updateExpense, deleteExpense, createExpense } = useExpense(
    `${yearMonth}-01`,
  );

  const handleAddExpense = () => {
    const today = formatDate(dayjs().toString(), "YYYY-MM-DD");

    const expenseForCreate: ExpenseForCreate = {
      date: today,
      category: "",
      amount: 0,
    };

    createExpense(expenseForCreate);
  };

  return (
    <SectionWrapper title={formatDate(yearMonth!)} navigateTo="/expenses">
      <div className="xl:w-4/6 ml-auto mr-auto">
        <ExpenseTable
          expenses={expenses}
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
