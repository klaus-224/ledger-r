// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// -- Modules
mod commands;
mod database;
mod models;

use std::sync::Arc;

// -- Imports
use commands::greet;
use database::Database;

fn main() {
    let db_state = Database::new("/data/data.duckdb".to_string());
    let db_state = Arc::new(db_state);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
