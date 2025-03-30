use duckdb::Connection;

// The state of our application, so far it only contains the connection
// which I will use once I start passing into the execution functions
pub struct DatabaseState {
    connecton: Connection,
}

impl DatabaseState {
    pub async fn new(db_path: String) -> Result<Self, String> {
        let connection = Connection::open(db_path).expect("Failed to open db connection");

        Ok(DatabaseState {
            connecton: connection,
        })
    }
}
