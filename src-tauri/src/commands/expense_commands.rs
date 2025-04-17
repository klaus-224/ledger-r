use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{Expense, ExpenseController, ExpenseDateFilter, ExpenseForCreate},
};

use super::{params::ListParams, response::IpcResponse};

#[command(rename_all = "camelCase")]
pub fn get_expenses_by_date(
    store_state: State<DuckStore>,
    params: ListParams<ExpenseDateFilter>,
) -> IpcResponse<Vec<Expense>> {
    let params = params.data;
    ExpenseController::get_by_date(store_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn create_expense(
    db_state: State<DuckStore>,
    params: ExpenseForCreate,
) -> IpcResponse<Expense> {
    ExpenseController::create(db_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn update_expense(store_state: State<DuckStore>, params: Expense) -> IpcResponse<i64> {
    ExpenseController::update(store_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn delete_expense(store_state: State<DuckStore>, params: i64) -> IpcResponse<i64> {
    ExpenseController::delete(store_state.inner(), params).into()
}
