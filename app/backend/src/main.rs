// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

use anyhow::Result;
use common::constants::CONFIG;
use std::sync::Arc;
use tauri::{generate_context, generate_handler, Builder, Manager};

#[derive(Debug, Clone)]
pub struct AppState {
    pub db_client: Arc<mongodb::Client>,
    pub http_client: Arc<reqwest::Client>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let db_client = Arc::new(mongodb::Client::with_uri_str(format!("{}", CONFIG.db.url)).await?);
    let http_client = Arc::new(reqwest::Client::new());

    let state = AppState {
        db_client: Arc::clone(&db_client),
        http_client: Arc::clone(&http_client),
    };

    Ok(Builder::default()
        .setup(|app| {
            if let Some(window) = app.get_window("main") {
                let _ = window_shadows::set_shadow(&window, true);
            }

            Ok(())
        })
        .manage(state)
        .invoke_handler(generate_handler![
            commands::get_file_stats,
            commands::download_and_save_file,
            commands::kill_process,
            commands::get_db_collection_stats,
            commands::backup_db,
            commands::create_unique_db_index,
            commands::get_db_items,
            commands::add_db_items,
            commands::update_db_items,
            commands::remove_db_items,
        ])
        .run(generate_context!())?)
}
