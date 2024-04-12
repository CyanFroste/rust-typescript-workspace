use crate::AppState;
use bson::{doc, Document};
use common::controllers;
use common::types::{db, errors::Result, FileStats, ProcessStats};
use tauri::{command, State};

#[command]
pub fn get_file_stats(path: &str) -> Result<FileStats> {
    controllers::get_file_stats(path)
}

#[command]
pub async fn download_and_save_file(
    state: State<'_, AppState>,
    url: &str,
    path: &str,
) -> Result<()> {
    controllers::download_and_save_file(&state.http_client, url, path).await
}

#[command]
pub fn kill_process(name: &str) -> Option<ProcessStats> {
    controllers::kill_process(name)
}

#[command]
pub async fn get_db_collection_stats(
    state: State<'_, AppState>,
) -> Result<Vec<db::CollectionStats>> {
    controllers::db::get_collection_stats(&state.db_client).await
}

#[command]
pub async fn backup_db(state: State<'_, AppState>) -> Result<String> {
    controllers::db::backup(&state.db_client).await
}

#[command]
pub async fn create_unique_db_index(
    state: State<'_, AppState>,
    collection: &str,
    keys: Document,
) -> Result<String> {
    controllers::db::create_unique_index(&state.db_client, collection, keys).await
}

#[command]
pub async fn get_db_items(
    state: State<'_, AppState>,
    params: db::GetItemsParams,
) -> Result<Vec<db::WithId<Document>>> {
    controllers::db::get_items(&state.db_client, params).await
}

#[command]
pub async fn add_db_items(
    state: State<'_, AppState>,
    params: db::AddItemsParams,
) -> Result<Vec<db::WithId<Document>>> {
    controllers::db::add_items(&state.db_client, params).await
}

#[command]
pub async fn update_db_items(
    state: State<'_, AppState>,
    params: db::UpdateItemsParams,
) -> Result<Vec<db::WithId<Document>>> {
    controllers::db::update_items(&state.db_client, params).await
}

#[command]
pub async fn remove_db_items(
    state: State<'_, AppState>,
    params: db::RemoveItemsParams,
) -> Result<Vec<db::WithId<Document>>> {
    controllers::db::remove_items(&state.db_client, params).await
}
