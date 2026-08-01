# app/core/cloudinary_config.py
import cloudinary
from app.core.config import settings
from app.core.loggers import logger

logger.info("CLOUDINARY CONFIG LOADING:", repr(settings.CLOUDINARY_CLOUD_NAME))

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

logger.info("CLOUDINARY CONFIGURED:", cloudinary.config().cloud_name)
