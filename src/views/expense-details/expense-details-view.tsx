import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { useExpense } from "@lib/hooks/useExpense";

// TODO:
// need to get the expense data here using the yearMonth param => probably need to augment with the day (0 - ( 28, 29, 30, 31 ))
// make a new expense view
const ExpenseView = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();
  const isNewExpense = !yearMonth;

  const { expenses } = useExpense(`${yearMonth}-01`);
  console.log(expenses);

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
        <ExpenseTable />
      </div>
    </div>
  );
};

export default ExpenseView;
