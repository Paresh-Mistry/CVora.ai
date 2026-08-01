from supabase import create_client, Client
from app.core.config import settings

# Client key — used for normal authentication operations
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_PUBLISHABLE_KEY,
)

# Secret key — server-side only
supabase_admin: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SECRET_KEY,
)