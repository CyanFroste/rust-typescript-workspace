use crate::AppState;
use anyhow::Context;
use axum::body::{Body, Bytes};
use axum::extract::State;
use axum::http::{header, HeaderMap, HeaderName, Method, StatusCode, Uri};
use axum::response::IntoResponse;
use common::constants::DEFAULT_USER_AGENT;
use common::types::errors::Result;
use reqwest as client;
use std::str::FromStr;

pub async fn handler(
    state: State<AppState>,
    method: Method,
    uri: Uri,
    headers: HeaderMap,
    body: Bytes,
) -> Result<impl IntoResponse> {
    let method = method_to_client_method(method);
    let mut url = uri.path().trim_start_matches("/proxy/").to_string();

    if let Some(query) = uri.query() {
        url.push('?');
        url.push_str(query);
    }

    let mut req = state.http_client.request(method, &url);

    for (ref k, ref o) in [(header::RANGE, client::header::RANGE)] {
        if let Some(v) = headers.get(k).and_then(|h| h.to_str().ok()) {
            req = req.header(o, v);
        }
    }

    let res = req
        .header(client::header::USER_AGENT, DEFAULT_USER_AGENT)
        .body(body)
        .send()
        .await?;

    let status: StatusCode = res
        .status()
        .as_u16()
        .try_into()
        .context("CONVERT_STATUS_CODE")?;

    let mapped = client_headers_to_headers(&res.headers());
    let mut headers = HeaderMap::new();

    for ref key in [
        header::CONTENT_TYPE,
        header::CONTENT_LENGTH,
        header::ACCEPT_RANGES,
        header::ACCEPT_RANGES,
        header::RANGE,
        header::CONTENT_RANGE,
    ] {
        if let Some(v) = mapped.get(key) {
            headers.insert(key, v.clone());
        }
    }

    Ok((status, headers, Body::from_stream(res.bytes_stream())))
}

fn method_to_client_method(method: Method) -> client::Method {
    match method {
        Method::POST => client::Method::POST,
        _ => client::Method::GET,
    }
}

fn client_headers_to_headers(headers: &client::header::HeaderMap) -> HeaderMap {
    let mut res = HeaderMap::new();

    for (key, value) in headers {
        if let (Ok(key), Ok(Ok(value))) = (
            HeaderName::from_str(key.as_str()),
            value.to_str().and_then(|x| Ok(x.parse())),
        ) {
            res.insert(key, value);
        }
    }

    res
}
