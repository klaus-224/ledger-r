use crate::duck_store::{Createable, DuckStore, Entity, Filterable, Patchable};
use crate::error::Result;
use duckdb::ToSql;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

// startregion:  --- Expense
#[derive(Serialize, Deserialize, TS)]
#[ts(
    export,
    export_to = "../../src/lib/types/models.ts",
    rename_all = "camelCase"
)]
pub struct Expense {
    pub id: i32,
    pub date: String,
    pub category: String,
    pub amount: f32,
}

impl Entity for Expense {
    fn from_row(row: &duckdb::Row) -> std::result::Result<Self, duckdb::Error> {
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
    fn get_id(&self) -> i32 {
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
#[derive(Deserialize, TS)]
#[ts(
    export,
    export_to = "../../src/lib/types/models.ts",
    rename_all = "camelCase"
)]
#[serde(rename_all = "camelCase")]
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
#[derive(Deserialize, TS)]
#[ts(
    export,
    export_to = "../../src/lib/types/models.ts",
    rename_all = "camelCase"
)]
pub struct ExpenseForCreate {
    pub date: String,
    pub category: String,
    pub amount: f32,
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

// startregion: --- MonthSummary

#[derive(Serialize, TS)]
#[ts(
    export,
    export_to = "../../src/lib/types/models.ts",
    rename_all = "camelCase"
)]
#[serde(rename_all = "camelCase")]
pub struct MonthSummary {
    pub month: String,
    pub expenses: i32,
}

impl Entity for MonthSummary {
    fn from_row(row: &duckdb::Row) -> std::result::Result<Self, duckdb::Error> {
        let month_summary = MonthSummary {
            month: row.get(0)?,
            expenses: row.get(1)?,
        };

        Ok(month_summary)
    }
}
// endregion:   --- MonthSummary

// startregion: --- ExpenseController
pub struct ExpenseController();

impl ExpenseController {
    pub fn create(store: &DuckStore, params: ExpenseForCreate) -> Result<Expense> {
        store.execute_create("expenses", params)
    }

    pub fn get_by_date(store: &DuckStore, params: ExpenseDateFilter) -> Result<Vec<Expense>> {
        store.execute_select(params)
    }

    pub fn get_expense_summary(store: &DuckStore) -> Result<Vec<MonthSummary>> {
        let sql = "SELECT strftime('%Y-%m', strptime(date, '%Y-%m-%d')) AS month, SUM(amount) AS total_expenses FROM expenses GROUP BY month ORDER BY month;";
        store.execute_select_no_filter(sql)
    }

    pub fn update(store: &DuckStore, params: Expense) -> Result<i32> {
        store.execute_update("expenses", params)
    }

    pub fn delete(store: &DuckStore, params: i32) -> Result<i32> {
        store.execute_delete("expenses", params)
    }
}
