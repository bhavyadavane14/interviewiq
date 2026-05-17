import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, text
from sqlalchemy.future import select
from datetime import datetime, timezone
import uuid

# Database configuration
# For hosting on Render, set DATABASE_URL in environment variables.
# For SQLite: sqlite+aiosqlite:///path/to/db
# For PostgreSQL: postgresql+asyncpg://user:pass@host/db
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    DB_PATH = os.path.join(os.path.dirname(__file__), "interviewiq.db")
    DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"
else:
    # Render provides postgres:// URLs, but SQLAlchemy requires postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String, default="user")
    created_at = Column(String)
    last_login = Column(String)
    total_interviews = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    streak = Column(Integer, default=0)
    readiness_status = Column(String, default="Not Ready")
    consent = Column(Boolean, default=False)

class InterviewDB(Base):
    __tablename__ = "interviews"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    interview_type = Column(String)
    focus_area = Column(String)
    status = Column(String)
    started_at = Column(String)
    completed_at = Column(String)
    overall_score = Column(Float)
    questions = Column(JSON, default=[])
    answers = Column(JSON, default=[])

class EvaluationDB(Base):
    __tablename__ = "evaluations"
    
    id = Column(String, primary_key=True)
    interview_id = Column(String, ForeignKey("interviews.id"))
    user_id = Column(String, ForeignKey("users.id"))
    overall_score = Column(Float)
    breakdown = Column(JSON, default={})
    strengths = Column(JSON, default=[])
    mistakes = Column(JSON, default=[])
    improvement_tips = Column(JSON, default=[])
    detailed_feedback = Column(JSON, default=[])
    readiness_flag = Column(String)
    created_at = Column(String)

# Helper to initialize the database
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Database Manager class to provide a similar API to Motor/MongoDB
class DatabaseManager:
    def __init__(self):
        self.users = CollectionWrapper(UserDB)
        self.interviews = CollectionWrapper(InterviewDB)
        self.evaluations = CollectionWrapper(EvaluationDB)

class CollectionWrapper:
    def __init__(self, model):
        self.model = model

    async def find_one(self, filter_dict, projection=None):
        async with AsyncSessionLocal() as session:
            query = select(self.model)
            for key, value in filter_dict.items():
                if hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)
            
            result = await session.execute(query)
            item = result.scalars().first()
            if item:
                # Convert SQLAlchemy model to dict
                res = {c.name: getattr(item, c.name) for c in item.__table__.columns}
                return res
            return None

    async def insert_one(self, data):
        async with AsyncSessionLocal() as session:
            item = self.model(**data)
            session.add(item)
            await session.commit()
            return item

    async def update_one(self, filter_dict, update_dict):
        async with AsyncSessionLocal() as session:
            query = select(self.model)
            for key, value in filter_dict.items():
                if hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)
            
            result = await session.execute(query)
            item = result.scalars().first()
            if item:
                if "$set" in update_dict:
                    for key, value in update_dict["$set"].items():
                        if hasattr(item, key):
                            setattr(item, key, value)
                else:
                    for key, value in update_dict.items():
                        if hasattr(item, key):
                            setattr(item, key, value)
                await session.commit()
                return True
            return False

    def find(self, filter_dict=None, projection=None):
        return QueryWrapper(self.model, filter_dict)

    async def count_documents(self, filter_dict):
        async with AsyncSessionLocal() as session:
            query = select(self.model)
            for key, value in filter_dict.items():
                if hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)
            
            result = await session.execute(query)
            items = result.scalars().all()
            return len(items)

class QueryWrapper:
    def __init__(self, model, filter_dict=None):
        self.model = model
        self.filter_dict = filter_dict or {}
        self.sort_field = None
        self.sort_dir = 1
        self.limit_val = None

    def sort(self, field, direction=-1):
        self.sort_field = field
        self.sort_dir = direction
        return self

    async def to_list(self, length=None):
        try:
            async with AsyncSessionLocal() as session:
                query = select(self.model)
                for key, value in self.filter_dict.items():
                    if hasattr(self.model, key):
                        query = query.where(getattr(self.model, key) == value)
                
                if self.sort_field and hasattr(self.model, self.sort_field):
                    if self.sort_dir == -1:
                        query = query.order_by(getattr(self.model, self.sort_field).desc())
                    else:
                        query = query.order_by(getattr(self.model, self.sort_field).asc())
                
                if length:
                    query = query.limit(length)
                    
                result = await session.execute(query)
                items = result.scalars().all()
                results = []
                for item in items:
                    row = {}
                    for c in item.__table__.columns:
                        val = getattr(item, c.name)
                        if isinstance(val, datetime):
                            val = val.isoformat()
                        row[c.name] = val
                    results.append(row)
                return results
        except Exception as e:
            print(f"Error in to_list: {e}")
            return []

db = DatabaseManager()
