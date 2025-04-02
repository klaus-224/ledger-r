use tauri::command;

use crate::models::expenses::Expense;

#[command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// TODO how do I use the connection string in my commands and moreover, how do I use them in my
// model functions?
#[command]
pub fn create_expense(expense: Expense) {}

//
#[command]
pub fn get_expenses(expense: Expense) {}
