import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import ExpenseView from "@views/expense";
import IncomeView from "@views/income";
import ExpenseDetailView from "@views/expense-details";
import NetoworthView from "@views/networth";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="networth" element={<NetoworthView />} />
        <Route path="income" element={<IncomeView />} />
        <Route path="expenses" element={<ExpenseView />} />
        <Route path="expenses/new" element={<ExpenseDetailView />} />
        <Route path="expenses/:yearMonth" element={<ExpenseDetailView />} />
      </Routes>
    </Layout>
  );
};

export default App;
