// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// --- Modules
mod commands;
mod error;
mod models;
mod query_builder;
mod store;

// -- Re-exports
pub use error::{AppError, Result};

// --- Imports
use commands::*;
use store::DuckStore;
use tauri::Manager;

fn main() -> Result<()> {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let db_path = if tauri::is_dev() {
                // started in dev mode
                store::init_dev_db("dev")
            } else {
                // for build
                store::init_prod_db(app)
            };

            let db_state = DuckStore::new(&db_path)?;
            app.manage(db_state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_expenses_by_date,
            get_expense_summary,
            create_expense,
            update_expense,
            delete_expense,
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
