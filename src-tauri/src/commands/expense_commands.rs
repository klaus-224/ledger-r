use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{
        Expense, ExpenseController, ExpenseDateFilter, ExpenseForCreate, MonthSummary,
    },
};

use super::{
    params::{DeleteParams, ListParams},
    response::IpcResponse,
};

#[command(rename_all = "camelCase")]
pub fn get_expenses_by_date(
    store_state: State<DuckStore>,
    params: ListParams<ExpenseDateFilter>,
) -> IpcResponse<Vec<Expense>> {
    let params = params.data;
    ExpenseController::get_by_date(store_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn get_expense_summary(store_state: State<DuckStore>) -> IpcResponse<Vec<MonthSummary>> {
    ExpenseController::get_expense_summary(store_state.inner()).into()
}

#[command(rename_all = "camelCase")]
pub fn create_expense(
    db_state: State<DuckStore>,
    params: ExpenseForCreate,
) -> IpcResponse<Expense> {
    ExpenseController::create(db_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn update_expense(store_state: State<DuckStore>, params: Expense) -> IpcResponse<i32> {
    ExpenseController::update(store_state.inner(), params).into()
}

#[command(rename_all = "camelCase")]
pub fn delete_expense(store_state: State<DuckStore>, params: DeleteParams) -> IpcResponse<i32> {
    ExpenseController::delete(store_state.inner(), params.id).into()
}
