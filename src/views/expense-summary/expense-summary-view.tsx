import SummaryCard from "@components/summary-card";
import { SectionWrapper } from "@components/ui/section-wrapper";
import { useExpenseSummary } from "@lib/hooks/useExpenseSummary";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const ExpenseSummary = () => {
  const navigate = useNavigate();

  const { summary } = useExpenseSummary();

  return (
    <SectionWrapper title="Expenses">
      <div className="flex flex-row justify-between items-center mb-10">
        <button className="button" onClick={() => navigate("/expenses/new")}>
          + New Expense
        </button>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-y-5">
        {summary.map((monthSummary) => (
          <SummaryCard
            key={monthSummary.month}
            month={dayjs(monthSummary.month).format("MMMM, YYYY").toString()}
            totalExpenses={monthSummary.expenses}
            onClick={() => navigate(`/expenses/${monthSummary.month}`)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ExpenseSummary;
