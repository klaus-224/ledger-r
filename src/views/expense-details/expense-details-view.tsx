import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";

const ExpenseView = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();
  const isNewExpense = !yearMonth;

  const { expenses, deleteExpense } = useExpense(`${yearMonth}-01`);
  console.log(expenses);

  const handleDelete = () => {
    deleteExpense(1);
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
        <h2>Expense Detail - {isNewExpense ? "New" : `${yearMonth}`}</h2>
        <input id="date-input" type="date" className="date-picker" />
        <button className="button">Save</button>
      </div>
      <div className="w-full relative">
        <button className="button" onClick={handleDelete}>
          delete
        </button>
        <ExpenseTable />
      </div>
    </div>
  );
};

export default ExpenseView;
