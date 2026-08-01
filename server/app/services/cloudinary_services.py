import asyncio
import cloudinary.uploader
from fastapi import UploadFile
from app.core.loggers import logger


class CloudinaryService:

    @staticmethod
    async def upload_image(file: UploadFile) -> dict:
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file.file,
            folder="cv_gen/avatars",  # optional, keeps uploads organized
            resource_type="image",
        )

        logger.info(f"Cloudinary upload result: {result}")
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }
