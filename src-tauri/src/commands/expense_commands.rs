use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{ExpenseController, ExpenseDateFilter},
};

#[command]
pub fn get_expenses(store_state: State<DuckStore>, filter: ExpenseDateFilter) {
    ExpenseController::get(store_state.inner(), filter);
}
