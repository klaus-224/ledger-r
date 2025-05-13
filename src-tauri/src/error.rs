use serde::Serialize;
use std::{
    fmt::Display,
    sync::{MutexGuard, PoisonError},
};
use ts_rs::TS;

use duckdb::Connection;

pub type Result<T> = std::result::Result<T, AppError>;

#[derive(Debug, thiserror::Error, Serialize, TS)]
#[serde(tag = "kind", content = "message")]
#[ts(export, export_to = "../../src/lib/types/models.ts")]
pub enum AppError {
    #[error("Database Error: {0}")]
    Database(String),
    #[error("Concurrency Error: {0}")]
    Concurrency(String),
    #[error("Tauri System Error: {0}")]
    TauriSystem(String),
}

impl From<duckdb::Error> for AppError {
    fn from(err: duckdb::Error) -> Self {
        AppError::Database(err.to_string())
    }
}

impl<T> From<PoisonError<T>> for AppError {
    fn from(err: PoisonError<T>) -> Self {
        AppError::Concurrency(err.to_string())
    }
}

impl From<tauri::Error> for AppError {
    fn from(err: tauri::Error) -> Self {
        AppError::TauriSystem(err.to_string())
    }
}
