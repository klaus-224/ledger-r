CREATE SEQUENCE IF NOT EXISTS seq_expense_id START 1;

CREATE TABLE IF NOT EXISTS expenses (
	id INTEGER PRIMARY KEY DEFAULT nextval('seq_expense_id'),
	date TEXT,
	category TEXT,
	amount INTEGER
)
