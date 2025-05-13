use crate::{error::Result, AppError};
use serde::Serialize;

#[derive(Serialize)]
pub struct IpcResult<D>
where
    D: Serialize,
{
    data: D,
}

#[derive(Serialize)]
pub struct IpcResponse<D>
where
    D: Serialize,
{
    error: Option<AppError>,
    result: Option<IpcResult<D>>,
}

impl<D> From<Result<D>> for IpcResponse<D>
where
    D: Serialize,
{
    fn from(res: Result<D>) -> Self {
        match res {
            Ok(data) => IpcResponse {
                error: None,
                result: Some(IpcResult { data }),
            },
            Err(app_err) => IpcResponse {
                error: Some(app_err),
                result: None,
            },
        }
    }
}
