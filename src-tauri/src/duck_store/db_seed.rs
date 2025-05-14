use std::env;
use std::fmt::format;

use duckdb::Connection;

pub fn db_seed(env: &str) -> String {
    // todo update this so that we can have a prod data dir and a dev data dir
    let mut current_dir = env::current_dir().unwrap();
    current_dir.push(".data");

    let db_dir = current_dir.as_path();
    let db_dir = db_dir.to_str().unwrap();
    // create the data dir if it doesn't exists
    std::fs::create_dir_all(db_dir).expect("Failed to create data directory");

    let db_path = format!("{}/{}.data.db", db_dir, env);

    // open db and apply schema
    let connection = Connection::open(&db_path).expect("Failed to open db connection");
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
    db_path
}
