pub mod db;

use crate::constants::DEFAULT_USER_AGENT;
use crate::types::{errors::Result, FileStats, ProcessStats};
use anyhow::Context;
use std::{fs, io::Write, time::UNIX_EPOCH};
use sysinfo::{ProcessRefreshKind, RefreshKind, System};

pub fn get_file_stats(path: &str) -> Result<FileStats> {
    let meta = fs::metadata(path)?;

    let modified_time: u64 = meta
        .modified()?
        .duration_since(UNIX_EPOCH)
        .context("COMPUTE_TIME_DURATION")?
        .as_millis()
        .try_into()
        .unwrap_or_default();

    Ok(FileStats {
        size: meta.len(),
        is_file: meta.is_file(),
        is_dir: meta.is_dir(),
        modified_time,
    })
}

pub async fn download_and_save_file(
    http_client: &reqwest::Client,
    url: &str,
    path: &str,
) -> Result<()> {
    let res = http_client
        .get(url)
        .header(reqwest::header::USER_AGENT, DEFAULT_USER_AGENT)
        .send()
        .await?;

    let body = res.bytes().await?;
    let mut file = fs::File::create(path)?;

    file.write_all(&body)?;
    file.flush()?;

    Ok(())
}

pub fn kill_process(name: &str) -> Option<ProcessStats> {
    let sys = System::new_with_specifics(
        RefreshKind::new().with_processes(ProcessRefreshKind::everything()),
    );

    for process in sys.processes_by_name(name) {
        if process.kill() {
            return Some(ProcessStats {
                name: process.name().into(),
                pid: process.pid().as_u32(),
            });
        }
    }

    None
}
