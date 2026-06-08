use governor::{clock::DefaultClock, state::InMemoryState, state::NotKeyed, Quota, RateLimiter};
use nonzero_ext::nonzero;
use std::sync::Arc;

#[derive(Clone)]
pub struct GlobalRateLimiter {
    inner: Arc<RateLimiter<NotKeyed, InMemoryState, DefaultClock>>,
}

impl GlobalRateLimiter {
    pub fn manga_dex_default() -> Self {
        Self {
            inner: Arc::new(RateLimiter::direct(Quota::per_second(nonzero!(5u32)))),
        }
    }

    pub async fn wait(&self) {
        self.inner.until_ready().await;
    }
}
