use std::sync::{MutexGuard, PoisonError};

use duckdb::Connection;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    DuckDBError(duckdb::Error),
    MutexLockError(String),
}

impl From<duckdb::Error> for Error {
    fn from(value: duckdb::Error) -> Self {
        Error::DuckDBError(value)
    }
}

impl<T> From<PoisonError<T>> for Error {
    fn from(value: PoisonError<T>) -> Self {
        Error::MutexLockError(value.to_string())
    }
}
