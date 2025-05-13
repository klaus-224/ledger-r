use super::{Createable, Entity, Filterable, Patchable};
use crate::{AppError, Result};
use duckdb::{params_from_iter, Connection};
use std::sync::Mutex;

// startregion: --- DuckStore
pub struct DuckStore {
    connection: Mutex<Connection>,
}

impl DuckStore {
    pub fn new(db_path: &str) -> Result<Self> {
        let connection = Connection::open(db_path).expect("Failed to open db connection");
        let schema_sql = include_str!("schemas/schema.sql");

        // TODO: This error is unrecoverable, I should implement some messaging to the FE and
        // then close the connection gracefully rather than letting it hang
        connection.execute_batch(schema_sql)?;

        Ok(DuckStore {
            connection: Mutex::new(connection),
        })
    }

    pub fn execute_create<C, E>(&self, tbl: &str, data: C) -> Result<E>
    where
        C: Createable,
        E: Entity,
    {
        let params = data.to_params();
        let columns = data.column_names().join(",");
        let placeholders = (0..params.len()).map(|_| "?").collect::<Vec<_>>().join(",");

        let sql = format!(
            "INSERT INTO {} ({}) VALUES ({}) RETURNING *",
            tbl, columns, placeholders
        );

        // TODO: This error is unrecoverable, I should implement some messaging to the FE and
        // then close the connection gracefully rather than letting it hang
        let conn = self.connection.lock()?;

        let mut stmt = conn.prepare(&sql)?;

        let entity = stmt.query_row(params_from_iter(params), |row| E::from_row(row))?;

        Ok(entity)
    }

    // TODO: I don't like this => we are just passing SQL here
    pub fn execute_select<F, E>(&self, filter: F) -> Result<Vec<E>>
    where
        F: Filterable,
        E: Entity,
    {
        let (sql, expr) = filter.to_params();
        let conn = self.connection.lock()?;

        // TODO: This error is unrecoverable, I should implement some messaging to the FE and
        // then close the connection gracefully rather than letting it hang
        let mut stmt = conn.prepare(sql)?;

        let entity_list = stmt.query_map(params_from_iter(expr.iter()), |row| E::from_row(row))?;

        entity_list.map(|res| res.map_err(AppError::from)).collect()
    }

    // TODO: I don't like this => we are just passing SQL here
    pub fn execute_select_no_filter<E>(&self, sql: &str) -> Result<Vec<E>>
    where
        E: Entity,
    {
        let conn = self.connection.lock()?;
        // TODO: This error is unrecoverable, I should implement some messaging to the FE and
        // then close the connection gracefully rather than letting it hang
        let mut stmt = conn.prepare(sql)?;
        let entity_list = stmt.query_map([], |row| E::from_row(row))?;
        entity_list.map(|res| res.map_err(AppError::from)).collect()
    }

    pub fn execute_delete(&self, tbl: &str, id: i32) -> Result<i32> {
        // TODO: This error is unrecoverable, I shoul  implement some messaging to the FE and
        // then close the connection gracefully rather than letting it hang
        let conn = self.connection.lock()?;

        let sql = format!("DELETE FROM {} WHERE id = ?", tbl);

        conn.execute(&sql, [id])?;

        // this could be updated to query the Row and return it after
        Ok(id)
    }

    pub fn execute_update<P>(&self, tbl: &str, data: P) -> Result<i32>
    where
        P: Patchable,
    {
        let id = data.get_id();
        let columns = data.column_names();
        let params = data.to_params();
        let placeholders = columns
            .iter()
            .map(|col| format!("{} = ?", col))
            .collect::<Vec<_>>()
            .join(",");

        let sql = format!("UPDATE {} SET {} WHERE id = {}", tbl, placeholders, id);

        let conn = self.connection.lock()?;

        conn.execute(&sql, params_from_iter(params.iter()))?;

        // this could be updated to query the Row and return it after
        Ok(id)
    }
}
// endregion: --- DuckStore

// startregion: --- TESTS
#[cfg(test)]
mod tests {

    use super::*;
    use crate::{
        duck_store::db_seed,
        models::expenses::{Expense, ExpenseDateFilter, ExpenseForCreate, MonthSummary},
    };

    async fn setup_test_db() -> DuckStore {
        let db_path = db_seed("test");

        DuckStore::new(&db_path).expect("Failed to create test database")
    }

    #[tokio::test]
    async fn test_select_all_expenses() {
        let db = setup_test_db().await;

        {
            let conn = db
                .connection
                .lock()
                .expect("Failed to get database connection");
            let seed = include_str!("seeds/test_seed.sql");

            conn.execute_batch(seed)
                .expect("Failed to seed the database");
        }

        let filter = ExpenseDateFilter {
            start_date: "2025-04-01".to_string(),
            end_date: "2025-05-01".to_string(),
        };

        let expenses: Vec<Expense> = db
            .execute_select(filter)
            .expect("Failed to select expenses");

        assert_eq!(expenses.len(), 7);
        assert_eq!(expenses[0].date, "2025-04-02");
        assert_eq!(expenses[0].category, "Travel");
        assert_eq!(expenses[0].amount, 625.0);
    }

    #[tokio::test]
    async fn test_create_expense() {
        let db = setup_test_db().await;

        let expense_for_create = ExpenseForCreate {
            date: "2025-04-07".to_string(),
            category: "Games".to_string(),
            amount: 35.0,
        };

        let expense: Expense = db.execute_create("expenses", expense_for_create).unwrap();

        assert_eq!(expense.date, "2025-04-07");
        assert_eq!(expense.category, "Games");
        assert_eq!(expense.amount, 35.0);
    }

    #[tokio::test]
    async fn test_delete_expense() {
        let db = setup_test_db().await;

        let id = db.execute_delete("expenses", 1).unwrap();

        assert_eq!(id, 1);
    }

    #[tokio::test]
    async fn test_update_expense() {
        let db = setup_test_db().await;

        let expense_for_update = Expense {
            id: 2,
            date: "2025-03-05".to_string(),
            category: "Transport".to_string(),
            amount: 900.0,
        };

        let id = db.execute_update("expenses", expense_for_update).unwrap();

        assert_eq!(id, 2);
    }

    #[tokio::test]
    async fn test_get_summary_expense() {
        let db = setup_test_db().await;
        let sql = "SELECT strftime('%Y-%m', strptime(date, '%Y-%m-%d')) AS month, SUM(amount) AS total_expenses FROM expenses GROUP BY month ORDER BY month;";
        let month_summary_list: Vec<MonthSummary> = db
            .execute_select_no_filter(sql)
            .expect("Failed to get monthly expense summary");
        assert_eq!(month_summary_list.len(), 3);
        assert_eq!(month_summary_list[0].month, "2025-03");
        assert_eq!(month_summary_list[0].expenses, 4052);
        assert_eq!(month_summary_list[1].month, "2025-04");
        assert_eq!(month_summary_list[1].expenses, 3762);
        assert_eq!(month_summary_list[2].month, "2025-05");
        assert_eq!(month_summary_list[2].expenses, 3544);
    }
}
// endregion:   --- TESTS
