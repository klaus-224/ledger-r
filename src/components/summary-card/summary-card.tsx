interface Props {
	onClick: () => void;
}

const SummaryCard = ({onClick}: Props) => {
  return (
    <div className="expense-card" onClick={onClick}>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-2">Expense Title</h3>
        <p className="text-gray-400">$250.00</p>
      </div>
    </div>
  );
};

export default SummaryCard;
