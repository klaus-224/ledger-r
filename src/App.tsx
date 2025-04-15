import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import ExpenseWindow from "@windows/expense";
import IncomeWindow from "@windows/income";
import ExpenseDetailWindow from "@windows/expense-details-window";
import NetworthWindow from "@windows/networth";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="networth" element={<NetworthWindow />} />
        <Route path="income" element={<IncomeWindow />} />
        <Route path="expenses" element={<ExpenseWindow />} />
        <Route path="expenses/new" element={<ExpenseDetailWindow />} />
        <Route path="expenses/:yearMonth" element={<ExpenseDetailWindow />} />
      </Routes>
    </Layout>
  );
};

export default App;
