// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
//#![allow(unused)]

// -- Modules
mod commands;
mod database;
mod models;

// -- Imports
use commands::get_expenses;
use database::Database;

fn main() {
    let db_state = Database::new("/data/data.duckdb");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![get_expenses])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
