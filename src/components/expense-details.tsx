import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "./expense-table";
import { invoke } from "@tauri-apps/api/core";
import { ExpenseForCreate } from "../types/models";

const ExpenseDetail = () => {
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

export default ExpenseDetail;
