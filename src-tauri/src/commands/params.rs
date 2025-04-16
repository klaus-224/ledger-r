use serde::Deserialize;

#[derive(Deserialize)]
pub struct ListParams<F> {
    pub data: F,
}
