// The state of our application, so far it only contains the duckdb connection

use std::sync::Mutex;

use duckdb::{Connection, Error, Row};

pub trait Entity: Sized {
    fn table_name() -> &'static str;
    fn from_row(row: &Row) -> Result<Self, Error>;
    fn to_params(&self) -> Vec<&(dyn duckdb::ToSql + Sync)>;
}

pub struct Database {
    connection: Mutex<Connection>,
}

impl Database {
    pub async fn new(db_path: String) -> Result<Self, String> {
        let connection = Connection::open(db_path).expect("Failed to open db connection");

        Ok(Database {
            connection: Mutex::new(connection),
        })
    }
}

impl Database {
    // just return id
    fn execute_create(&self) {
        todo!()
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

// -- TESTS
#[cfg(test)]
mod tests {
    use crate::models::expenses::Expense;

    use super::*;
    use std::sync::Once;
    use uuid::Uuid;

    static INIT: Once = Once::new();

    async fn setup_test_db() -> Database {
        // create dir for test dbs
        std::fs::create_dir_all("test-db").expect("Failed to create test-db directory");

        // Initialize test db
        let uuid = Uuid::new_v4();

        // TODO WHAT IS HAPPENING HERE
        let db_name = format!("test_db_{}.db", uuid);
        //let db_url = format!("/test/{}", db_name);
        let db_url = "test_db.db".to_string();
        // TODO WHAT IS HAPPENING HERE

        // create test database
        let db = Database::new(db_url)
            .await
            .expect("Failed to create test database");

        // create the connection
        {
            let conn = &db.connection.lock().unwrap();

            // create test table
            conn.execute(
                "CREATE TABLE expenses (date TEXT, category TEXT, amount INTEGER)",
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
}
