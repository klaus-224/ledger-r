import Layout from "@components/layout";
import { Route, Routes } from "react-router";
import NetworthPane from "./panes/networth-pane";
import ExpensePane from "./panes/expense-pane";
import IncomePane from "./panes/income-pane";
import ExpenseDetail from "@components/expense-details";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="networth" element={<NetworthPane/>}/>
        <Route path="income" element={<IncomePane/>}/>
        <Route path="expenses" element={<ExpensePane/>}/>
				<Route path="expenses/new" element={<ExpenseDetail/>}/>
        <Route path="expenses/:yearMonth" element={<ExpenseDetail/>}/>
      </Routes>
    </Layout>
  );
};

export default App;
