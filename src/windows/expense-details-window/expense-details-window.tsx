import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "@components/expense-table";
import { invoke } from "@tauri-apps/api/core";
import { ExpenseForCreate } from "@lib/types/models";

// TODO:
// need to get the expense data here using the yearMonth param => probably need to augment with the day (0 - ( 28, 29, 30, 31 ))
const ExpenseDetailWindow = () => {
  const navigate = useNavigate();
  const { yearMonth } = useParams();

  const isNewExpense = !yearMonth;

  const createExpense = async () => {
    const expense: ExpenseForCreate = {
      date: "2025-04-11",
      category: "Food",
      amount: 20,
    };
    try {
      const response = await invoke("create_expense", {
        data: expense,
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
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
        <button className="button" onClick={() => createExpense()}>
          Create Expense
        </button>
        {/* <ExpenseTable /> */}
      </div>
    </div>
  );
};

export default ExpenseDetailWindow;
