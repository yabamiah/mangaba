use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Clone)]
pub struct ApiCache {
    db: sled::Db,
}

#[derive(Serialize, Deserialize)]
struct CacheEnvelope {
    expires_at: u64,
    body: String,
}

impl ApiCache {
    pub fn open(path: PathBuf) -> Result<Self> {
        Ok(Self {
            db: sled::open(path)?,
        })
    }

    pub fn get(&self, key: &str) -> Result<Option<String>> {
        let Some(raw) = self.db.get(key)? else {
            return Ok(None);
        };
        let envelope: CacheEnvelope = serde_json::from_slice(&raw)?;
        if envelope.expires_at < now_seconds() {
            self.db.remove(key)?;
            return Ok(None);
        }
        Ok(Some(envelope.body))
    }

    pub fn set(&self, key: &str, body: &str, ttl_seconds: u64) -> Result<()> {
        let envelope = CacheEnvelope {
            expires_at: now_seconds() + ttl_seconds,
            body: body.to_string(),
        };
        self.db.insert(key, serde_json::to_vec(&envelope)?)?;
        self.db.flush()?;
        Ok(())
    }

    pub fn clear(&self) -> Result<()> {
        self.db.clear()?;
        self.db.flush()?;
        Ok(())
    }
}

fn now_seconds() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or_default()
}
