// The state of our application, so far it only contains the duckdb connection
use super::{Createable, Entity, Filterable};
use duckdb::{params_from_iter, Connection, Error};
use std::sync::Mutex;
pub struct Database {
    connection: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, Error> {
        let connection = Connection::open(db_path).expect("Failed to open db connection");
        let schema_sql = include_str!("schema.sql");

        connection.execute_batch(schema_sql)?;

        Ok(Database {
            connection: Mutex::new(connection),
        })
    }
}

impl Database {
    pub fn execute_create<C, E>(self, tbl: &str, data: C) -> Result<E, Error>
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

        let conn = self.connection.lock().unwrap(); // TODO this need to be better

        let mut stmt = conn.prepare(&sql)?;

        let entity: E = stmt.query_row(params_from_iter(params), |row| E::from_row(row))?;

        Ok(entity)
    }

    // return a vec of Entity
    pub fn execute_select<F, E>(self, filter: F) -> Result<Vec<E>, Error>
    where
        F: Filterable,
        E: Entity,
    {
        let (sql, expr) = filter.to_params();
        let conn = self.connection.lock().unwrap(); // TODO this need to be better

        let mut stmt = conn.prepare(sql)?;

        let entity = stmt.query_map(params_from_iter(expr.iter()), |row| E::from_row(row))?;

        entity.collect()
    }
}

// region:      -- TESTS
#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::expenses::{Expense, ExpenseDateFilter, ExpenseForCreate};
    use std::{env, iter::Filter, sync::Once};
    use uuid::Uuid;

    static INIT: Once = Once::new();

    async fn setup_test_db() -> Database {
        let test_dir = ".tmp".to_string();
        std::fs::create_dir_all(&test_dir).expect("Failed to create test-db directory");
        let db_path = format!("{}/test_db.db", test_dir);

        let db = Database::new(&db_path).expect("Failed to create test database");

        {
            let conn = db
                .connection
                .lock()
                .expect("Failed to get database connection");
            let seed = include_str!("test_seed.sql");

            conn.execute_batch(seed);
        }

        db
    }

    #[tokio::test]
    async fn test_select_all_expenses() {
        let db = setup_test_db().await;

        let filter = ExpenseDateFilter {
            start_date: "2025-04-01".to_string(),
            end_date: "2025-05-01".to_string(),
        };

        let expenses: Vec<Expense> = db
            .execute_select(filter)
            .expect("Failed to select expenses");

        assert_eq!(expenses.len(), 21);
        assert_eq!(expenses[0].date, "2025-04-01");
        assert_eq!(expenses[0].category, "Food");
        assert_eq!(expenses[0].amount, 366);
    }

    #[tokio::test]
    async fn test_create_expense() {
        let db = setup_test_db().await;

        let expense_for_create = ExpenseForCreate {
            date: "2025-04-07".to_string(),
            category: "Games".to_string(),
            amount: 35,
        };

        let expense: Expense = db.execute_create("expenses", expense_for_create).unwrap();

        assert_eq!(expense.date, "2025-04-07");
        assert_eq!(expense.category, "Games");
        assert_eq!(expense.amount, 35);
    }
}
