use tauri::{command, State};

use crate::{
    duck_store::DuckStore,
    models::expenses::{Expense, ExpenseController, ExpenseDateFilter},
};

use super::response::IpcResponse;

#[command]
pub fn get_expenses(
    store_state: State<DuckStore>,
    date_filter: ExpenseDateFilter,
) -> IpcResponse<Vec<Expense>> {
    ExpenseController::get_by_date(store_state.inner(), date_filter).into()
}
