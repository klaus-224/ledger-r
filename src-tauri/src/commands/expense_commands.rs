use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{Expense, ExpenseController, ExpenseDateFilter},
};

#[command]
pub fn get_expenses(store_state: State<DuckStore>, date_filter: ExpenseDateFilter) {
    ExpenseController::get_by_date(store_state.inner(), date_filter);
}
