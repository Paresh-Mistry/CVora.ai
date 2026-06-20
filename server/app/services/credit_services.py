from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.config import settings
from app.model.credit import Credit
from app.model.user import User


# Maps feature → (free_total, premium_total)
CREDIT_LIMITS: dict[str, tuple[int, int]] = {
    "ai":           (settings.FREE_AI_CREDITS,           settings.PREMIUM_AI_CREDITS),
    "ats":          (settings.FREE_ATS_CREDITS,          9999),
    "cover_letter": (settings.FREE_COVER_LETTER_CREDITS, 9999),
}


class CreditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ── Ensure credit row exists for every feature ────────────────────────────

    async def ensure_credits(self, user: User):
        """
        Called once after registration (or lazily on first use).
        Uses INSERT … ON CONFLICT DO NOTHING so it's idempotent.
        """
        plan_idx = 1 if user.plan == "premium" else 0
        for feature, limits in CREDIT_LIMITS.items():
            total = limits[plan_idx]
            stmt = (
                pg_insert(Credit)
                .values(user_id=user.id, feature=feature, used=0, total=total)
                .on_conflict_do_nothing(index_elements=["user_id", "feature"])
            )
            await self.db.execute(stmt)
        await self.db.commit()

    # ── Check ─────────────────────────────────────────────────────────────────

    async def has_credit(self, user: User, feature: str) -> bool:
        credit = await Credit.get(self.db, user.id, feature)
        if not credit:
            await self.ensure_credits(user)
            credit = await Credit.get(self.db, user.id, feature)
        return credit is not None and credit.remaining > 0

    # ── Consume ───────────────────────────────────────────────────────────────

    async def consume(self, user: User, feature: str) -> int:
        """Deducts one credit and returns remaining count."""
        credit = await Credit.get(self.db, user.id, feature)
        if not credit or credit.remaining <= 0:
            raise ValueError(f"No {feature} credits remaining")
        credit.used += 1
        self.db.add(credit)
        await self.db.commit()
        return credit.remaining

    # ── Read ──────────────────────────────────────────────────────────────────

    async def get_all(self, user: User) -> dict[str, Credit]:
        await self.ensure_credits(user)
        result = {}
        for feature in CREDIT_LIMITS:
            credit = await Credit.get(self.db, user.id, feature)
            result[feature] = credit
        return result

    # ── Upgrade plan (called by payment webhook) ──────────────────────────────

    async def upgrade_to_premium(self, user: User):
        for feature, limits in CREDIT_LIMITS.items():
            credit = await Credit.get(self.db, user.id, feature)
            if credit:
                credit.total = limits[1]   # premium total
                self.db.add(credit)
        user.plan = "premium"
        self.db.add(user)
        await self.db.commit()