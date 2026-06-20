from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.model.tenplates import Template, seed_templates
from app.schema.schemas import TemplateOut
from app.db.redis_client import get_redis
import json 
from app.core.loggers import logger


router = APIRouter(prefix="/templates", tags=["templates"])
DB = Annotated[AsyncSession, Depends(get_db)]

CACHE_KEY = "templates:all"
CACHE_TTL_SECONDS = 3600  

@router.get("/", response_model=List[TemplateOut])
async def list_templates(user: CurrentUser, db: DB):
    """
    Returns all templates. Frontend should visually lock premium ones
    if user.plan == 'free'.
    """
    r = await get_redis()
    cached = await r.get(CACHE_KEY)
    if cached: 
        logger.info("Serving Redis")
        return json.loads(cached)
    
    # idempotent — only inserts if missing
    await seed_templates(db)   
    templates = await Template.get_all(db)
    result = [TemplateOut.model_validate(t).model_dump() for t in templates]
    await r.setex(CACHE_KEY, CACHE_TTL_SECONDS, json.dumps(result))  
    return result   