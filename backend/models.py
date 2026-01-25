from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"

class InterviewType(str, Enum):
    HR = "HR"
    TECHNICAL = "Technical"
    BEHAVIORAL = "Behavioral"

class ReadinessStatus(str, Enum):
    READY = "Ready"
    NEEDS_PRACTICE = "Needs Practice"
    NOT_READY = "Not Ready"

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    consent: bool

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    email: str
    name: str
    role: Role = Role.USER
    created_at: str
    last_login: Optional[str] = None
    total_interviews: int = 0
    average_score: float = 0.0
    streak: int = 0
    readiness_status: ReadinessStatus = ReadinessStatus.NOT_READY

class InterviewStart(BaseModel):
    interview_type: InterviewType
    focus_area: Optional[str] = None

class Interview(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    user_id: str
    interview_type: InterviewType
    focus_area: Optional[str] = None
    status: str
    started_at: str
    completed_at: Optional[str] = None
    overall_score: Optional[float] = None
    questions: List[Dict[str, Any]] = []
    answers: List[Dict[str, Any]] = []

class AnswerSubmit(BaseModel):
    interview_id: str
    question_id: str
    answer_text: str

class Evaluation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    interview_id: str
    user_id: str
    overall_score: float
    breakdown: Dict[str, float]
    strengths: List[str]
    mistakes: List[Dict[str, str]]
    improvement_tips: List[str]
    readiness_flag: ReadinessStatus
    created_at: str

class PracticeQuestion(BaseModel):
    id: str
    category: InterviewType
    question: str
    ideal_answer: str
    key_points: List[str]
    common_mistakes: List[str]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User