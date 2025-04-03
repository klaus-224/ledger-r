// The state of our application, so far it only contains the duckdb connection

use duckdb::{Connection, Error, Row};
use std::sync::Mutex;

// -- START ENTITY
pub trait Entity: Sized {
    fn table_name() -> &'static str;
    fn from_row(row: &Row) -> Result<Self, Error>;
    fn to_params(&self) -> Vec<&(dyn duckdb::ToSql)>;
}
// -- END ENTITY

// -- START DATABASE
pub struct Database {
    connection: Mutex<Connection>,
}

impl Database {
    pub async fn new(db_path: &str) -> Result<Self, String> {
        let connection = Connection::open(db_path).expect("Failed to open db connection");

        Ok(Database {
            connection: Mutex::new(connection),
        })
    }
}

impl Database {
    // just return id
    fn execute_create<T: Entity>(&self, entity: T) -> Result<T, duckdb::Error> {
        let table_name = T::table_name();
        let params = entity.to_params();

        let placeholders = (0..params.len()).map(|_| "?").collect::<Vec<_>>().join(",");

        let sql = format!(
            "INSERT into {} VALUES ({}) RETURNING *",
            table_name, placeholders
        );

        let db_lock = self.connection.lock().unwrap(); // TODO: better way to handle error

        let mut stmt = db_lock.prepare(&sql)?;

        let entity: T = stmt.query_row(duckdb::params_from_iter(params.iter()), |row| {
            T::from_row(row)
        })?;

        Ok(entity)
    }

    // just return id
    fn execute_update(&self) {
        todo!()
    }

    // just return id
    fn exeucte_delete(&self) {
        todo!()
    }

    // return a vec of Entity
    pub fn execute_select<T: Entity>(self, filter: &str) -> Result<Vec<T>, duckdb::Error> {
        let table_name = T::table_name();
        let query = format!("SELECT * FROM {} WHERE {}", table_name, filter);
        let db_lock = self.connection.lock().unwrap(); // TODO: better way to handle error
        let mut stmt = db_lock.prepare(&query)?;

        let results = stmt.query_map([], |row| T::from_row(row))?;

        results.collect()
    }

    fn execute_get(&self) {
        todo!()
    }
}
// -- END DATABASE

// -- TESTS
#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::expenses::Expense;
    use std::{env, sync::Once};
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
        let db = Database::new(db_path.to_str().unwrap())
            .await
            .expect("Failed to create test database");

        // create the connection
        {
            let conn = &db.connection.lock().unwrap();

            // create test table
            conn.execute(
                "CREATE TABLE IF NOT EXISTS expenses (date TEXT, category TEXT, amount INTEGER)",
                [],
            )
                .expect("Failed to create expense table");

            // create test data
            conn.execute(
                "INSERT INTO expenses (date, category, amount) VALUES ('2025-04-01', 'Food', '1000')",
                [],
            )
        }
        .expect("Failed to insert test data");

        db
    }

    //-- START TESTS
    #[tokio::test]
    async fn test_select_all_expenses() {
        let db = setup_test_db().await;

        // testing select
        let expenses: Vec<Expense> = db
            .execute_select::<Expense>("1=1")
            .expect("Failed to select expenses");

        // verify results
        assert_eq!(expenses.len(), 1);
        assert_eq!(expenses[0].date, "2025-04-01");
        assert_eq!(expenses[0].category, "Food");
        assert_eq!(expenses[0].amount, 1000);
    }

    #[tokio::test]
    async fn test_create_expense() {
        let db = setup_test_db().await;

        let expense = Expense {
            date: "2025-04-02".to_string(),
            category: "Games".to_string(),
            amount: 90,
        };

        let expense: Expense = db.execute_create(expense).unwrap();

        assert_eq!(expense.date, "2025-04-02");
        assert_eq!(expense.category, "Games");
        assert_eq!(expense.amount, 90);
    }
}
