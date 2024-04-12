mod routes;

use anyhow::Result;
use axum::routing::{any, post};
use axum::Router;
use common::constants::CONFIG;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

#[derive(Debug, Clone)]
pub struct AppState {
    pub db_client: mongodb::Client,
    pub http_client: reqwest::Client,
}

#[tokio::main]
async fn main() -> Result<()> {
    let listener = TcpListener::bind(("0.0.0.0", CONFIG.servers.api.port as u16)).await?;

    let db_client = mongodb::Client::with_uri_str(format!("{}", CONFIG.db.url)).await?;
    let http_client = reqwest::Client::new();

    let state = AppState {
        db_client,
        http_client,
    };

    let router = Router::new()
        .route("/db/items", post(routes::get_db_items))
        .route("/db/items/add", post(routes::add_db_items))
        .route("/db/items/update", post(routes::update_db_items))
        .route("/db/items/remove", post(routes::remove_db_items))
        .route("/proxy/*url", any(routes::proxy::handler));

    Ok(axum::serve(
        listener,
        Router::new()
            .nest("/api", router)
            .layer(CorsLayer::permissive())
            .with_state(state),
    )
    .await?)
}
