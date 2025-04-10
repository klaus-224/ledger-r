use tauri::command;

use crate::{
    database::Database,
    models::expenses::{ExpenseController, ExpenseDateFilter},
};

#[command]
pub fn get_expenses(database: Database, filter: ExpenseDateFilter) {
    ExpenseController::get(database, filter);
}
