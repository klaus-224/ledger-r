import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

const ExpenseDetail = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();

  const isNewExpense = !yearMonth;

  return (
    <div className="pane">
      <div className="flex flex-row items-center mb-10 gap-2">
        <button
          className="icon-button"
          type="button"
          onClick={() => navigate("/expenses")}
        >
          <FaArrowLeft />
        </button>
        <h2>Expense Detail - {isNewExpense ? "New" : `${yearMonth}`}</h2>
      </div>

      <div>Expense detail</div>
    </div>
  );
};

export default ExpenseDetail;
