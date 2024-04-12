use crate::types::Config;
use once_cell::sync::Lazy;

pub static CONFIG: Lazy<Config> =
    Lazy::new(|| serde_json::from_str(include_str!("../../../config.json")).unwrap());

pub static USER_AGENTS: Lazy<Vec<String>> =
    Lazy::new(|| serde_json::from_str(include_str!("../../../data/user_agents.json")).unwrap());

pub const DEFAULT_USER_AGENT: &str = "<your_user_agent>";
