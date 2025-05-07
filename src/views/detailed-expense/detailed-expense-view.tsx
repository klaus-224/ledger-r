import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";
import dayjs from "dayjs";
import { ExpenseForCreate } from "@lib/types/models";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { formatDate } from "@lib/utils/utils";
import { CircleArrowLeft } from "lucide-react";

const DetailedExpense = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();

  const { expenses, updateExpense, deleteExpense, createExpense } = useExpense(
    `${yearMonth}-01`,
  );

  const handleAddExpense = () => {
    const today = dayjs().format("YYYY-MM-DD");

    const expenseForCreate: ExpenseForCreate = {
      date: today,
      category: "",
      amount: 0,
    };

    createExpense(expenseForCreate);
  };

  return (
    <SectionWrapper title={formatDate(yearMonth!)}>
      <CircleArrowLeft
        className="cusor-pointer"
        size={24}
        onClick={() => navigate("/expenses")}
      />
      <div className="xl:w-4/6 ml-auto mr-auto">
        <ExpenseTable
          expenses={expenses}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
        />
        <div className="mt-5 w-full flex justify-end">
          <button className="button" onClick={handleAddExpense}>
            Add Expense +
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default DetailedExpense;
