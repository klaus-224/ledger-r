// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// --- Modules
mod commands;
mod duck_store;
mod models;

// --- Imports
use commands::get_expenses;
use duck_store::DuckStore;

fn main() {
    let db_state = DuckStore::new("/data/data.duckdb");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![get_expenses])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
