pub mod proxy;

use crate::AppState;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::Json;
use common::controllers;
use common::types::{db, errors::Result};

#[axum::debug_handler]
pub async fn get_db_items(
    state: State<AppState>,
    Json(params): Json<db::GetItemsParams>,
) -> Result<impl IntoResponse> {
    Ok(Json(
        controllers::db::get_items(&state.db_client, params).await?,
    ))
}

#[axum::debug_handler]
pub async fn add_db_items(
    state: State<AppState>,
    Json(params): Json<db::AddItemsParams>,
) -> Result<impl IntoResponse> {
    Ok(Json(
        controllers::db::add_items(&state.db_client, params).await?,
    ))
}

#[axum::debug_handler]
pub async fn update_db_items(
    state: State<AppState>,
    Json(params): Json<db::UpdateItemsParams>,
) -> Result<impl IntoResponse> {
    Ok(Json(
        controllers::db::update_items(&state.db_client, params).await?,
    ))
}

#[axum::debug_handler]
pub async fn remove_db_items(
    state: State<AppState>,
    Json(params): Json<db::RemoveItemsParams>,
) -> Result<impl IntoResponse> {
    Ok(Json(
        controllers::db::remove_items(&state.db_client, params).await?,
    ))
}
