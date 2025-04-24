import { FaArrowLeft } from "react-icons/fa";
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
      <div className="flex flex-row items-center justify-between mb-10">
        <button
          className="icon-button"
          type="button"
          onClick={() => navigate("/expenses")}
        >
          <FaArrowLeft />
        </button>
        <h2>Expense Detail - {yearMonth}</h2>
      </div>
      <div className="table-container">
        <ExpenseTable
          expenses={expenses}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
          onAdd={handleAddExpense}
        />
      </div>
    </div>
  );
};

export default DetailedExpense;
