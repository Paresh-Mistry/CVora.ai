import redis.asyncio as aioredis
from app.core.config import settings

_redis: aioredis.Redis | None = None

async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = await aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


# Token blacklist (logout / refresh rotation) 
async def blacklist_token(jti: str, ttl_seconds: int):
    r = await get_redis()
    await r.setex(f"bl:{jti}", ttl_seconds, "1")


async def is_blacklisted(jti: str) -> bool:
    r = await get_redis()
    return await r.exists(f"bl:{jti}") == 1