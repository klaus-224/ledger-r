import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ExpenseTable from "./expense-table";

const ExpenseDetail = () => {
	const navigate = useNavigate();
	const { yearMonth } = useParams();

	const isNewExpense = !yearMonth;

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
				<ExpenseTable />
			</div>
		</div>
	);
};

export default ExpenseDetail;
