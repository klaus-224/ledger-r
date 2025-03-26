import SummaryCard from "@components/summary-card";

const ExpensePane = () => {
  const array = new Array(12).fill(1);

  return (
    <div className="pane">
      <div className="flex flex-row justify-between items-center">
        <h2>Expenses</h2>
        <button className="button">+ New Expense</button>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-y-5 mt-10">
        {array.map(() => (
          <SummaryCard />
        ))}
      </div>
    </div>
  );
};

export default ExpensePane;

