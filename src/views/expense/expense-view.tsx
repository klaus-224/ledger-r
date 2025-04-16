import SummaryCard from "@components/summary-card";
import { useNavigate } from "react-router";

const ExpenseView = () => {
  const array = new Array(4).fill(1);
  const navigate = useNavigate();
  // TODO:
  // need to get distinct year/month
  // need to get aggregation of expenses in the mont

  return (
    <div className="pane">
      <div className="flex flex-row justify-between items-center mb-10">
        <h2>Expenses</h2>
        <button className="button" onClick={() => navigate("/expenses/new")}>
          + New Expense
        </button>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-y-5">
        {array.map(() => (
          <SummaryCard onClick={() => navigate("/expenses/2025-04")} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseView;
