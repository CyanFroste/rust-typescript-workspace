use crate::constants::{CONFIG, USER_AGENTS};
use mongodb::{Client, Collection};
use rand::{thread_rng, Rng};

pub fn get_random_user_agent() -> String {
    USER_AGENTS[thread_rng().gen_range(0..USER_AGENTS.len())].clone()
}

pub fn get_db_collection<T>(db_client: &Client, name: &str) -> Collection<T> {
    db_client.database(&CONFIG.db.name).collection(name)
}
