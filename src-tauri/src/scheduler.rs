use crate::models::SyncStatus;
use chrono::Utc;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct SyncScheduler {
    inner: Arc<Mutex<SyncStatus>>,
}

impl SyncScheduler {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(SyncStatus {
                is_syncing: false,
                last_sync: None,
                errors: Vec::new(),
            })),
        }
    }

    pub fn begin(&self) {
        self.inner.lock().unwrap().is_syncing = true;
    }

    pub fn finish(&self, errors: Vec<String>) {
        let mut status = self.inner.lock().unwrap();
        status.is_syncing = false;
        status.last_sync = Some(Utc::now().to_rfc3339());
        status.errors = errors;
    }

    pub fn status(&self) -> SyncStatus {
        self.inner.lock().unwrap().clone()
    }
}
