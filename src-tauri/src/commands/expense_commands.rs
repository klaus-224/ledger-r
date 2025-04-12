use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{Expense, ExpenseController, ExpenseDateFilter, ExpenseForCreate},
};

use super::response::IpcResponse;

#[command]
pub fn get_expenses_by_date(
    store_state: State<DuckStore>,
    date_filter: ExpenseDateFilter,
) -> IpcResponse<Vec<Expense>> {
    ExpenseController::get_by_date(store_state.inner(), date_filter).into()
}

#[command]
pub fn create_expense(db_state: State<DuckStore>, data: ExpenseForCreate) -> IpcResponse<Expense> {
    ExpenseController::create(db_state.inner(), data).into()
}

#[command]
pub fn update_expense(store_state: State<DuckStore>, data: Expense) -> IpcResponse<i64> {
    ExpenseController::update(store_state.inner(), data).into()
}

#[command]
pub fn delete_expense(store_state: State<DuckStore>, id: i64) -> IpcResponse<i64> {
    ExpenseController::delete(store_state.inner(), id).into()
}
