import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import NetworthPane from "./panes/networth-pane";
import ExpensePane from "./panes/expense-pane";
import IncomePane from "./panes/income-pane";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="networth" element={<NetworthPane/>}/>
        <Route path="income" element={<IncomePane/>}/>
        <Route path="expenses" element={<ExpensePane/>}/>
      </Routes>
    </Layout>
  );
};

export default App;
