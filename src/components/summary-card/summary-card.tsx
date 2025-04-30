// need to add interface for object of this type:
//
// {
// 	date: String,
// 	totalExpense: String,

import { MonthSummary } from "@lib/types/models";

// }
interface Props {
  month: string;
  totalExpenses: number;
  onClick: () => void;
}

const SummaryCard = ({ month, totalExpenses, onClick }: Props) => {
  return (
    <div className="expense-card" onClick={onClick}>
      <div className="p-4">
        <h3 className="text-md font-medium mb-2 text-muted-foreground">
          {month}
        </h3>
        <p className="text-lg text-foreground ">$ {totalExpenses}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
