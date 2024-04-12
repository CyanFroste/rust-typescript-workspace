use crate::types::PaginationParams;
use bson::serde_helpers::serialize_object_id_as_hex_string;
use bson::{oid::ObjectId, Document};
use serde::{Deserialize, Serialize};
use std::ops::Deref;

#[derive(Debug, Serialize, Deserialize)]
pub struct WithId<T> {
    #[serde(serialize_with = "serialize_object_id_as_hex_string")]
    pub _id: ObjectId,
    #[serde(flatten)]
    pub core: T,
}

impl<T> Deref for WithId<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.core
    }
}

impl<T> From<(ObjectId, T)> for WithId<T> {
    fn from((_id, core): (ObjectId, T)) -> Self {
        Self { _id, core }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionStats {
    pub name: String,
    pub count: i32,
    pub size: i32,
    pub item_size: i32,
}

#[derive(Debug, Deserialize)]
pub struct GetItemsParams {
    pub collection: String,
    pub filters: Option<Document>,
    pub pagination: Option<PaginationParams>,
    pub sort: Option<Document>,
}

#[derive(Debug, Deserialize)]
pub struct AddItemsParams {
    pub collection: String,
    pub data: Vec<Document>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateItemsParams {
    pub collection: String,
    pub data: Vec<WithId<Document>>,
}

#[derive(Debug, Deserialize)]
pub struct RemoveItemsParams {
    pub collection: String,
    pub data: Vec<WithId<Document>>,
}
