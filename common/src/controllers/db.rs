use crate::constants::CONFIG;
use crate::types::db::{
    AddItemsParams, CollectionStats, GetItemsParams, RemoveItemsParams, UpdateItemsParams, WithId,
};
use crate::types::{errors::Result, PaginationParams, Timestamp};
use crate::utils::get_db_collection;
use bson::{doc, Document};
use futures::TryStreamExt;
use mongodb::options::{FindOptions, IndexOptions};
use mongodb::{Client, Collection, IndexModel};
use std::{fs, io::Write};

pub async fn get_collection_stats(client: &Client) -> Result<Vec<CollectionStats>> {
    let db = client.database(&CONFIG.db.name);
    let mut data = vec![];

    for name in db.list_collection_names(None).await? {
        let stats = db
            .run_command(doc! { "collStats": &name, "scale": 1 }, None)
            .await?;

        let count = stats.get_i32("count").unwrap_or_default(); // let count = coll.estimated_document_count(None).await?;
        let size = stats.get_i32("size").unwrap_or_default();
        let item_size = stats.get_i32("avgObjSize").unwrap_or_default();

        data.push(CollectionStats {
            name,
            count,
            size,
            item_size,
        })
    }

    Ok(data)
}

pub async fn backup(client: &Client) -> Result<String> {
    let db = client.database(&CONFIG.db.name);
    let path = format!("{}/{}", &CONFIG.db.backup_path, Timestamp::now().format());

    fs::create_dir_all(&path)?;

    for name in db.list_collection_names(None).await? {
        let coll: Collection<Document> = db.collection(&name);
        let res: Vec<_> = coll.find(None, None).await?.try_collect().await?;

        let content = serde_json::to_string(&res)?;
        let mut file = fs::File::create(format!("{}/{}.json", path, name))?;

        file.write_all(content.as_bytes())?;
        file.flush()?;
    }

    Ok(path)
}

pub async fn create_unique_index(
    client: &Client,
    collection: &str,
    keys: Document,
) -> Result<String> {
    let coll = get_db_collection::<Document>(client, collection);

    let created = coll
        .create_index(
            IndexModel::builder()
                .keys(keys)
                .options(IndexOptions::builder().unique(true).build())
                .build(),
            None,
        )
        .await?;

    Ok(format!("{}: {}", collection, created.index_name))
}

pub async fn add_items(
    client: &Client,
    AddItemsParams { collection, data }: AddItemsParams,
) -> Result<Vec<WithId<Document>>> {
    let coll = get_db_collection::<Document>(client, &collection);
    let mut res = vec![];

    for item in data {
        if let Ok(Some(id)) = coll
            .insert_one(&item, None)
            .await
            .and_then(|x| Ok(x.inserted_id.as_object_id()))
        {
            res.push((id, item).into());
        }
    }

    Ok(res)
}

pub async fn update_items(
    client: &Client,
    UpdateItemsParams { collection, data }: UpdateItemsParams,
) -> Result<Vec<WithId<Document>>> {
    let coll = get_db_collection::<WithId<Document>>(client, &collection);
    let mut res = vec![];

    for item in data {
        if let Ok(_) = coll
            .update_one(doc! { "_id": item._id }, doc! { "$set": &item.core }, None)
            .await
        {
            res.push(item);
        }
    }

    Ok(res)
}

pub async fn remove_items(
    client: &Client,
    RemoveItemsParams { collection, data }: RemoveItemsParams,
) -> Result<Vec<WithId<Document>>> {
    let coll = get_db_collection::<WithId<Document>>(client, &collection);
    let mut res = vec![];

    for item in data {
        if let Ok(_) = coll.delete_one(doc! { "_id": item._id }, None).await {
            res.push(item);
        }
    }

    Ok(res)
}

pub async fn get_items(
    client: &Client,
    GetItemsParams {
        collection,
        filters,
        pagination,
        sort,
    }: GetItemsParams,
) -> Result<Vec<WithId<Document>>> {
    let coll = get_db_collection::<WithId<Document>>(client, &collection);

    let options = if let Some(PaginationParams {
        limit: Some(limit), // only if limit exists
        page,
    }) = pagination
    {
        let page = page.unwrap_or(1);
        let skip = (page - 1) * limit;

        Some(
            FindOptions::builder()
                .skip(skip as u64)
                .limit(limit as i64)
                .sort(sort)
                .build(),
        )
    } else if let Some(sort) = sort {
        Some(FindOptions::builder().sort(sort).build())
    } else {
        None
    };

    Ok(coll.find(filters, options).await?.try_collect().await?)
}
