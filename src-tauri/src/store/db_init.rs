use std::env;
use std::fmt::format;

use duckdb::Connection;
use tauri::Manager;

pub fn init_prod_db(app: &tauri::App) -> String {
    // returns the user's data dir ($HOME/Library/Application Support/LedgerR/ on macos)
    let mut db_dir = app
        .path()
        .data_dir()
        .expect("Failed to get prod data directory");
    db_dir.push("LedgerR");

    // Create directory if needed
    std::fs::create_dir_all(&db_dir)
        .unwrap_or_else(|_| panic!("Failed to create directory at {:?}", db_dir));

    let db_path = db_dir.join("ledgerr.db");

    let connection =
        Connection::open(&db_path).unwrap_or_else(|_| panic!("Failed to open DB at {:?}", db_path));
    let schema_sql = include_str!("schemas/schema.sql");
    connection.execute_batch(schema_sql).unwrap();
    connection.close().unwrap();
    db_path.to_str().expect("invalid db path").to_string()
}

pub fn init_dev_db(env: &str) -> String {
    let mut db_dir = std::env::current_dir().expect("Failed to get current directory");
    db_dir.push(".data");

    // Create directory if needed
    std::fs::create_dir_all(&db_dir)
        .unwrap_or_else(|_| panic!("Failed to create directory at {:?}", db_dir));

    let db_path = db_dir.join(format!("{}.data.db", env));

    let connection =
        Connection::open(&db_path).unwrap_or_else(|_| panic!("Failed to open DB at {:?}", db_path));
    let schema_sql = include_str!("schemas/schema.sql");
    connection.execute_batch(schema_sql).unwrap();

    // seed the db
    let seed = match env {
        "dev" => include_str!("seeds/dev_seed.sql"),
        "test" => include_str!("seeds/test_seed.sql"),
        _ => "",
    };

    connection.execute_batch(seed).unwrap();
    connection.close().unwrap();
    db_path.to_str().expect("invalid db path").to_string()
}
