use crate::database::Entity;

pub struct Expense {
    pub date: String,
    pub category: String,
    pub amount: i32,
}

impl Entity for Expense {
    fn table_name() -> &'static str {
        "expenses"
    }

    fn from_row(row: &duckdb::Row) -> Result<Self, duckdb::Error> {
        Ok(Expense {
            date: row.get(0)?,
            category: row.get(1)?,
            amount: row.get(2)?,
        })
    }

    fn to_params(&self) -> Vec<&(dyn duckdb::ToSql + Sync)> {
        todo!()
    }
}
