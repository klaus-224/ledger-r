import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import ExpenseSummary from "@views/expense-summary";
import IncomeView from "@views/income";
import DetailedExpense from "@views/detailed-expense";
import NetoworthView from "@views/networth";
import NewExpense from "@views/new-expense";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="networth" element={<NetoworthView />} />
        <Route path="income" element={<IncomeView />} />
        <Route path="expenses" element={<ExpenseSummary />} />
        <Route path="expenses/new" element={<NewExpense />} />
        <Route path="expenses/:yearMonth" element={<DetailedExpense />} />
      </Route>
    </Routes>
  );
};

export default App;
