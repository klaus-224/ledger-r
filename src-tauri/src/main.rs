// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// -- Modules
mod commands;
mod database;
mod models;

// -- Imports
use commands::greet;

fn main() {
    let db_state = database::DatabaseState::new("./data/data.duckdb".to_string());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
