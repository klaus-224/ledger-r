import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";
import { Expense } from "@lib/types/models";

const DetailedExpense = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();

  const { expenses, updateExpense, deleteExpense } = useExpense(
    `${yearMonth}-01`,
  );

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
        <input id="date-input" type="date" className="date-picker" />
      </div>
      <div className="table-container">
        <ExpenseTable
          expenses={expenses}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
};

export default DetailedExpense;
