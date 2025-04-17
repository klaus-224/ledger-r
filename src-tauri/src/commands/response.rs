use crate::error::Result;
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, TS)]
#[ts(export, export_to = "../../src/lib/types/")]
pub struct IpcError {
    message: String,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../../src/lib/types/")]
pub struct IpcResult<D>
where
    D: Serialize + TS,
{
    data: D,
}

#[derive(Serialize, TS)]
#[ts(export, export_to = "../../src/lib/types/")]
pub struct IpcResponse<D>
where
    D: Serialize + TS,
{
    error: Option<IpcError>,
    result: Option<IpcResult<D>>,
}

impl<D> From<Result<D>> for IpcResponse<D>
where
    D: Serialize + TS,
{
    fn from(res: Result<D>) -> Self {
        match res {
            Ok(data) => IpcResponse {
                error: None,
                result: Some(IpcResult { data }),
            },
            Err(err) => IpcResponse {
                error: Some(IpcError {
                    message: format!("{err}"),
                }),
                result: None,
            },
        }
    }
}
