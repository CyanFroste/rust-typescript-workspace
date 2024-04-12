use crate::types::GenericResponse;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use tauri::InvokeError;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    Db(#[from] mongodb::error::Error),

    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),

    #[error(transparent)]
    SerdeJson(#[from] serde_json::Error),

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    BsonSerialize(#[from] bson::ser::Error),

    #[error(transparent)]
    HttpClient(#[from] reqwest::Error),

    #[error(transparent)]
    ChronoParse(#[from] chrono::ParseError),
}

impl From<Error> for InvokeError {
    fn from(err: Error) -> Self {
        InvokeError::from(GenericResponse {
            message: err.to_string(),
        })
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(GenericResponse {
                message: self.to_string(),
            }),
        )
            .into_response()
    }
}
