drop table expenses;

CREATE SEQUENCE IF NOT EXISTS seq_expense_id START 1;

CREATE TABLE IF NOT EXISTS expenses (
	id INTEGER PRIMARY KEY DEFAULT nextval('seq_expense_id'),
	date TEXT,
	category TEXT,
	amount FLOAT
);

INSERT INTO expenses (date, category, amount) VALUES ('2025-03-01', 'Food', '366');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-05', 'Transport', '775');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-12', 'Entertainment', '791');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-18', 'Utilities', '835');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-23', 'Health', '308');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-28', 'Education', '857');
INSERT INTO expenses (date, category, amount) VALUES ('2025-03-31', 'Shopping', '120');

INSERT INTO expenses (date, category, amount) VALUES ('2025-04-02', 'Travel', '625');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-07', 'Food', '216');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-11', 'Transport', '489');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-15', 'Entertainment', '935');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-19', 'Utilities', '690');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-24', 'Health', '638');
INSERT INTO expenses (date, category, amount) VALUES ('2025-04-30', 'Education', '169');

INSERT INTO expenses (date, category, amount) VALUES ('2025-05-03', 'Shopping', '85');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-08', 'Travel', '935');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-12', 'Food', '366');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-17', 'Transport', '436');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-21', 'Entertainment', '458');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-25', 'Utilities', '553');
INSERT INTO expenses (date, category, amount) VALUES ('2025-05-31', 'Health', '711');

