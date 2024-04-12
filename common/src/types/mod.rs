pub mod db;
pub mod errors;

use crate::constants::CONFIG;
use crate::types::errors::Error;
use chrono::{DateTime, Local, Utc};
use json_typegen::json_typegen;
use serde::{Deserialize, Serialize};
use std::str::FromStr;

// https://github.com/evestera/json_typegen
// https://github.com/evestera/json_typegen/blob/master/CONFIGURATION.md
json_typegen!("Config", "./config.json");

#[derive(Debug, Serialize)]
pub struct GenericResponse {
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ProcessStats {
    pub name: String,
    pub pid: u32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileStats {
    pub size: u64,
    pub is_dir: bool,
    pub is_file: bool,
    pub modified_time: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Timestamp(DateTime<Utc>);

impl Timestamp {
    pub fn now() -> Self {
        Self(Utc::now())
    }

    pub fn format(&self) -> String {
        self.0
            .with_timezone(&Local)
            .format(&CONFIG.timestamp_formats.chrono)
            .to_string()
    }
}

impl Default for Timestamp {
    fn default() -> Self {
        Self::now()
    }
}

impl FromStr for Timestamp {
    type Err = Error;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        // let utc = DateTime::parse_from_rfc3339(value)?;
        // let local = Local.from_utc_datetime(&utc.naive_utc()); // let local = utc.with_timezone(Local::now().offset());
        // Ok(Self(local))
        Ok(Self(
            DateTime::parse_from_rfc3339(value).map(|dt| dt.with_timezone(&Utc))?,
        ))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationParams {
    pub page: Option<u32>,
    pub limit: Option<u32>,
}
