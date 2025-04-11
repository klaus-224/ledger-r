pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    DuckDBError(duckdb::Error),
}

impl From<duckdb::Error> for Error {
    fn from(value: duckdb::Error) -> Self {
        Error::DuckDBError(value)
    }
}
