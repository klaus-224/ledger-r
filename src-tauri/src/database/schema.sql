CREATE SEQUENCE seq_expenseid START 1;


CREATE TABLE IF NOT EXISTS expenses (
	expense_id INTEGER PRIMARY KEY DEFAULT nextval('seq_expenseid'),
	date TEXT,
	category TEXT,
	amount INTEGER
)
