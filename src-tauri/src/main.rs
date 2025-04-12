// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// --- Modules
mod commands;
mod duck_store;
mod error;
mod models;

// -- Re-exports
pub use error::{Error, Result};

// --- Imports
use commands::*;
use duck_store::DuckStore;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let data_dir = ".data";
            let db_name = "data.db";
            std::fs::create_dir_all(data_dir).expect("Failed to create test-db directory");
            let db_path = format!("{}/test_db_{}.db", data_dir, db_name);

            let db_state = DuckStore::new(&db_path).unwrap();

            app.manage(db_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_expenses_by_date,
            create_expense,
            update_expense,
            delete_expense,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
