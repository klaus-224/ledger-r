use crate::error::Result;
use serde::Serialize;

#[derive(Serialize)]
pub struct IpcError {
    message: String,
}

#[derive(Serialize)]
pub struct IpcResult<D>
where
    D: Serialize,
{
    pub data: D,
}

#[derive(Serialize)]
pub struct IpcResponse<D>
where
    D: Serialize,
{
    error: Option<IpcError>,
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
            Err(err) => IpcResponse {
                error: Some(IpcError {
                    message: format!("{err}"),
                }),
                result: None,
            },
        }
    }
}
