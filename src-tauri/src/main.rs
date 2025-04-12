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

fn main() {
    let db_state = DuckStore::new("/data/data.duckdb");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![
            get_expenses_by_date,
            create_expense,
            update_expense,
            delete_expense,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
