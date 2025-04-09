use duckdb::{params, ToSql};

use crate::database::{Createable, Entity, Filterable, Patchable};

// startregion:  --- Expense
pub struct Expense {
    pub id: i64,
    pub date: String,
    pub category: String,
    pub amount: i32,
}

impl Entity for Expense {
    fn from_row(row: &duckdb::Row) -> Result<Self, duckdb::Error> {
        let expense = Expense {
            id: row.get(0)?,
            date: row.get(1)?,
            category: row.get(2)?,
            amount: row.get(3)?,
        };

        Ok(expense)
    }
}

impl Patchable for Expense {
    fn get_id(&self) -> i64 {
        self.id
    }

    fn column_names(&self) -> Vec<String> {
        vec![
            "date".to_string(),
            "category".to_string(),
            "amount".to_string(),
        ]
    }

    fn to_params(&self) -> Vec<&dyn ToSql> {
        vec![&self.date, &self.category, &self.amount]
    }
}
// endregion:  --- Expense

// startregion:  --- ExpenseDateFilter
pub struct ExpenseDateFilter {
    pub start_date: String,
    pub end_date: String,
}

impl Filterable for ExpenseDateFilter {
    fn to_params(&self) -> (&'static str, Vec<&dyn ToSql>) {
        let sql: &str = "SELECT * FROM expenses WHERE date >= ? and date <= ?";

        (sql, vec![&self.start_date, &self.end_date])
    }
}
// endregion:  --- ExpenseDateFilter

// startregion:   --- ExpenseForCreate
pub struct ExpenseForCreate {
    pub date: String,
    pub category: String,
    pub amount: i32,
}

impl Createable for ExpenseForCreate {
    fn to_params(&self) -> Vec<&dyn ToSql> {
        vec![&self.date, &self.category, &self.amount]
    }

    fn column_names(&self) -> Vec<String> {
        vec![
            "date".to_string(),
            "category".to_string(),
            "amount".to_string(),
        ]
    }
}
// endregion:   --- ExpenseForCreate
