use serde::Deserialize;

#[derive(Deserialize, ts_rs::TS)]
#[ts(
    export,
    export_to = "../../src/lib/types/models.ts",
    rename_all = "camelCase"
)]
#[serde(rename_all = "camelCase")]
pub struct ListParams<F> {
    pub data: F,
}
