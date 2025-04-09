// The state of our application, so far it only contains the duckdb connection
use super::{Createable, Entity, Filterable, Patchable};
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

    pub fn execute_select<F, E>(self, filter: F) -> Result<Vec<E>, Error>
    where
        F: Filterable,
        E: Entity,
    {
        let (sql, expr) = filter.to_params();
        let conn = self.connection.lock().unwrap(); // TODO this needs to be better

        let mut stmt = conn.prepare(sql)?;

        let entity = stmt.query_map(params_from_iter(expr.iter()), |row| E::from_row(row))?;

        entity.collect()
    }

    pub fn execute_delete(self, tbl: &str, id: i64) -> Result<i64, Error> {
        let conn = self.connection.lock().unwrap(); // TODO this needs to be better

        let sql = format!("DELETE FROM {} WHERE id = ?", tbl);

        conn.execute(&sql, [id]);

        // this could be updated to query the Row and return it after
        Ok(id)
    }

    pub fn execute_update<P>(self, tbl: &str, data: P) -> Result<i64, Error>
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

        let conn = self.connection.lock().unwrap(); // TODO make this beter

        conn.execute(&sql, params_from_iter(params.iter()))?;

        // this could be updated to query the Row and return it after
        Ok(id)
    }
}

// start region:      -- TESTS
#[cfg(test)]
mod tests {
    use std::{fs, path::Path};

    use super::*;
    use crate::models::expenses::{Expense, ExpenseDateFilter, ExpenseForCreate};

    static DB_PATH: Mutex<Option<String>> = Mutex::new(None);

    async fn setup_test_db(test_name: &str) -> Database {
        let test_dir = ".tmp".to_string();

        std::fs::create_dir_all(&test_dir).expect("Failed to create test-db directory");

        let db_path = format!("{}/test_db_{}.db", test_dir, test_name);

        *DB_PATH.lock().unwrap() = Some(db_path.clone());

        Database::new(&db_path).expect("Failed to create test database")
    }

    #[tokio::test]
    async fn test_select_all_expenses() {
        let db = setup_test_db("select-expenses").await;

        {
            let conn = db
                .connection
                .lock()
                .expect("Failed to get database connection");
            let seed = include_str!("test_seed.sql");

            conn.execute_batch(seed);
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
        assert_eq!(expenses[0].amount, 625);
    }

    #[tokio::test]
    async fn test_create_expense() {
        let db = setup_test_db("create-expenses").await;

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

    #[tokio::test]
    async fn test_delete_expense() {
        let db = setup_test_db("delete-expenses").await;

        {
            let conn = db
                .connection
                .lock()
                .expect("Failed to get database connection");
            let seed = include_str!("test_seed.sql");

            conn.execute_batch(seed);
        }

        let id = db.execute_delete("expenses", 1).unwrap();

        assert_eq!(id, 1);
    }

    #[tokio::test]
    async fn test_update_expense() {
        let db = setup_test_db("update-expenses").await;

        {
            let conn = db
                .connection
                .lock()
                .expect("Failed to get database connection");
            let seed = include_str!("test_seed.sql");

            conn.execute_batch(seed);
        }

        let expense_for_update = Expense {
            id: 2,
            date: "2025-03-05".to_string(),
            category: "Transport".to_string(),
            amount: 900,
        };

        let id = db.execute_update("expenses", expense_for_update).unwrap();

        assert_eq!(id, 2);
    }
}
// -- end region:       TESTS
