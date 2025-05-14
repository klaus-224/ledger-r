use duckdb::Error;
use duckdb::Row;
use duckdb::ToSql;

mod db_init;
mod duck_store;

// --- re-exports
pub use db_init::*;
pub use duck_store::DuckStore;

pub trait Entity: Sized {
    fn from_row(row: &Row) -> Result<Self, duckdb::Error>;
}

pub trait Createable {
    fn to_params(&self) -> Vec<&dyn ToSql>;
    fn column_names(&self) -> Vec<String>;
}

pub trait Filterable {
    fn to_params(&self) -> (&'static str, Vec<&dyn ToSql>);
}

pub trait Patchable {
    fn get_id(&self) -> i32;
    fn column_names(&self) -> Vec<String>;
    fn to_params(&self) -> Vec<&dyn ToSql>;
}
