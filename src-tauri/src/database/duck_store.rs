// The state of our application, so far it only contains the duckdb connection
use duckdb::{params_from_iter, Connection, Error};
use std::sync::Mutex;

use super::{Createable, Entity, Filterable};

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
        let placeholders = (0..params.len()).map(|_| "?").collect::<Vec<_>>().join(",");

        let sql = format!("INSERT INTO {} VALUES {} RETURNING id", tbl, placeholders);

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

// -- TESTS
#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::expenses::{Expense, ExpenseDateFilter};
    use std::{env, iter::Filter, sync::Once};
    use uuid::Uuid;

    static INIT: Once = Once::new();

    // Helper to initialize database
    async fn setup_test_db() -> Database {
        // create dir for test dbs
        let project_dir = env::current_dir().expect("Failed to get current directory");
        let test_db_dir = project_dir.join("test-db");
        std::fs::create_dir_all(&test_db_dir).expect("Failed to create test-db directory");

        // Initialize test db
        let uuid = Uuid::new_v4();

        let db_name = format!("test_db_{}.db", uuid);
        let db_path = test_db_dir.join(db_name);

        // create test database
        let db = Database::new(db_path.to_str().unwrap()).expect("Failed to create test database");

        // create the connection
        {
            let conn = &db.connection.lock().unwrap();

            // create test data
            conn.execute(
                "INSERT INTO expenses (date, category, amount) VALUES ('2025-04-01', 'Food', '1000')",
                [],
            ).expect("Failed to insert test data");
        }

        db
    }

    //-- START TESTS
    #[tokio::test]
    async fn test_select_all_expenses() {
        let db = setup_test_db().await;

        let filter = ExpenseDateFilter {
            start_date: "2025-04-01".to_string(),
            end_date: "2025-05-01".to_string(),
        };

        // testing select
        let expenses: Vec<Expense> = db
            .execute_select(filter)
            .expect("Failed to select expenses");

        // verify results
        assert_eq!(expenses.len(), 1);
        assert_eq!(expenses[0].date, "2025-04-01");
        assert_eq!(expenses[0].category, "Food");
        assert_eq!(expenses[0].amount, 1000);
    }

    //
    //    #[tokio::test]
    //    async fn test_create_expense() {
    //        let db = setup_test_db().await;
    //
    //        let expense = Expense {
    //            date: "2025-04-02".to_string(),
    //            category: "Games".to_string(),
    //            amount: 90,
    //        };
    //
    //        let expense: Expense = db.execute_create(expense).unwrap();
    //
    //        assert_eq!(expense.date, "2025-04-02");
    //        assert_eq!(expense.category, "Games");
    //        assert_eq!(expense.amount, 90);
    //    }
}
