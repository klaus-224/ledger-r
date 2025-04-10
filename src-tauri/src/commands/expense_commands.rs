use tauri::command;

use crate::{
    duck_store::DuckStore,
    models::expenses::{ExpenseController, ExpenseDateFilter},
};

#[command]
pub fn get_expenses(store: DuckStore, filter: ExpenseDateFilter) {
    ExpenseController::get(store, filter);
}
