import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";
import dayjs from "dayjs";
import { ExpenseForCreate } from "@lib/types/models";

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
    <div className="pane">
      <div className="flex flex-row items-center">
        <button
          className="icon-button"
          type="button"
          onClick={() => navigate("/expenses")}
        ></button>
        <h2 className="view-header ml-5">
          {dayjs(yearMonth).format("MMMM, YYYY").toString()}
        </h2>
      </div>
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
    </div>
  );
};

export default DetailedExpense;
