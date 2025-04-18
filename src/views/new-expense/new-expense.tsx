import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

const NewExpense = () => {
  const navigate = useNavigate();

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
        <h2>New Expense</h2>
        <input id="date-input" type="date" className="date-picker" />
        <button className="button">Save</button>
      </div>
      <div className="w-full relative">{/* <ExpenseTable /> */}</div>
    </div>
  );
};

export default NewExpense;
