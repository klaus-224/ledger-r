import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import NetworthPane from "@windows/networth";
import ExpensePane from "@windows/expense";
import IncomePane from "@windows/income";
import ExpenseDetail from "@components/expense-details";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="networth" element={<NetworthPane />} />
        <Route path="income" element={<IncomePane />} />
        <Route path="expenses" element={<ExpensePane />} />
        <Route path="expenses/new" element={<ExpenseDetail />} />
        <Route path="expenses/:yearMonth" element={<ExpenseDetail />} />
      </Routes>
    </Layout>
  );
};

export default App;
