from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from models import (
    User, UserCreate, UserLogin, TokenResponse, Role, InterviewType,
    InterviewStart, Interview, AnswerSubmit, Evaluation, PracticeQuestion,
    ReadinessStatus
)
from auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from ai_service import AIService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("Interview_143", "interviewiq")

if not mongo_url:
    raise RuntimeError("MONGO_URL is not set in environment variables")

client = AsyncIOMotorClient(mongo_url)
db = client[Interview_143]


app = FastAPI()
api_router = APIRouter(prefix="/api")

ai_service = AIService()

QUESTION_BANK = {
    InterviewType.HR: [
        {
            "question": "Tell me about yourself.",
            "ideal_answer": "Start with your current role, highlight relevant experience, mention key achievements, and connect to the role you're applying for.",
            "key_points": ["Current role", "Relevant experience", "Key achievements", "Career goals"],
            "common_mistakes": ["Being too personal", "Rambling without structure", "Not tailoring to the job"]
        },
        {
            "question": "What are your strengths and weaknesses?",
            "ideal_answer": "Choose strengths relevant to the role with examples. For weaknesses, mention something you're actively working to improve.",
            "key_points": ["Relevant strengths", "Real examples", "Honest weakness", "Improvement plan"],
            "common_mistakes": ["Generic answers", "Fake weaknesses", "No examples"]
        },
        {
            "question": "Why should we hire you?",
            "ideal_answer": "Highlight your unique value proposition, relevant skills, and how you can solve their problems or contribute to their goals.",
            "key_points": ["Unique value", "Relevant skills", "Company knowledge", "Problem solving"],
            "common_mistakes": ["Being arrogant", "Generic response", "Not researching company"]
        },
        {
            "question": "Describe a challenge you faced and how you handled it.",
            "ideal_answer": "Use STAR method: Situation, Task, Action, Result. Focus on your specific actions and the positive outcome.",
            "key_points": ["Clear situation", "Your role", "Specific actions", "Measurable results"],
            "common_mistakes": ["Blaming others", "No clear resolution", "Vague details"]
        },
        {
            "question": "How do you handle pressure and deadlines?",
            "ideal_answer": "Describe your prioritization strategy, time management techniques, and give a specific example of handling pressure successfully.",
            "key_points": ["Prioritization", "Time management", "Staying calm", "Real example"],
            "common_mistakes": ["Saying you never feel pressure", "No concrete examples"]
        },
        {
            "question": "Where do you see yourself in 5 years?",
            "ideal_answer": "Show ambition aligned with the company's growth path. Mention skills you want to develop and value you want to add.",
            "key_points": ["Career growth", "Skill development", "Company alignment", "Realistic goals"],
            "common_mistakes": ["Too vague", "Different career path", "No growth mindset"]
        },
        {
            "question": "What motivates you at work?",
            "ideal_answer": "Connect your motivation to the role's responsibilities. Mention intrinsic factors like learning, impact, or teamwork.",
            "key_points": ["Intrinsic motivation", "Role relevance", "Growth mindset", "Team contribution"],
            "common_mistakes": ["Only money", "Too generic", "Not role-specific"]
        }
    ],
    InterviewType.TECHNICAL: [
        {
            "question": "Explain a project you have worked on.",
            "ideal_answer": "Describe the problem, your technical approach, technologies used, challenges faced, and the impact of your solution.",
            "key_points": ["Problem statement", "Technical solution", "Your contribution", "Impact/results"],
            "common_mistakes": ["Too technical without context", "No mention of impact", "Taking all credit"]
        },
        {
            "question": "What is the difference between stack and queue?",
            "ideal_answer": "Stack is LIFO (Last In First Out), queue is FIFO (First In First Out). Give real-world examples and use cases.",
            "key_points": ["LIFO vs FIFO", "Operations", "Use cases", "Time complexity"],
            "common_mistakes": ["No examples", "Confusing the concepts", "No practical use cases"]
        },
        {
            "question": "What is an API and why is it used?",
            "ideal_answer": "API is a set of protocols for building software. It allows different applications to communicate. Explain with REST or GraphQL examples.",
            "key_points": ["Definition", "Purpose", "Types (REST, GraphQL)", "Real example"],
            "common_mistakes": ["Too vague", "No examples", "Only theoretical"]
        },
        {
            "question": "How do you debug an application?",
            "ideal_answer": "Describe your systematic approach: reproduce the bug, check logs, use debugging tools, isolate the issue, fix and test.",
            "key_points": ["Reproduce bug", "Check logs", "Use debugger", "Root cause analysis", "Testing"],
            "common_mistakes": ["Random fixes", "No systematic approach", "Not testing fix"]
        },
        {
            "question": "Explain one technology you are confident in.",
            "ideal_answer": "Choose a relevant technology, explain its purpose, your experience level, projects where you used it, and why you like it.",
            "key_points": ["Technology name", "Your experience", "Real projects", "Why you chose it"],
            "common_mistakes": ["Too shallow", "No practical experience", "Outdated technology"]
        },
        {
            "question": "What is the difference between frontend and backend?",
            "ideal_answer": "Frontend is client-side (UI/UX, user interactions), backend is server-side (logic, database, APIs). Mention technologies for each.",
            "key_points": ["Frontend definition", "Backend definition", "Technologies", "How they interact"],
            "common_mistakes": ["Oversimplifying", "No mention of technologies", "Confusing terms"]
        },
        {
            "question": "What is database normalization?",
            "ideal_answer": "Process of organizing data to reduce redundancy. Explain 1NF, 2NF, 3NF with examples and benefits.",
            "key_points": ["Definition", "Normal forms", "Benefits", "Trade-offs"],
            "common_mistakes": ["Only definition", "No examples", "Not explaining why it matters"]
        }
    ],
    InterviewType.BEHAVIORAL: [
        {
            "question": "Describe a time you worked in a team.",
            "ideal_answer": "Use STAR method. Highlight your role, collaboration skills, how you handled conflicts, and the team's success.",
            "key_points": ["Team context", "Your role", "Collaboration", "Outcome"],
            "common_mistakes": ["Only 'I' statements", "No specific example", "Negative team comments"]
        },
        {
            "question": "Tell me about a conflict you faced and how you resolved it.",
            "ideal_answer": "Describe the conflict objectively, your approach to resolution, communication used, and the positive outcome.",
            "key_points": ["Conflict context", "Your approach", "Communication", "Resolution"],
            "common_mistakes": ["Blaming others", "Avoiding conflict", "No resolution shown"]
        },
        {
            "question": "Describe a failure and what you learned from it.",
            "ideal_answer": "Be honest about the failure, take ownership, explain what you learned, and how you applied that learning.",
            "key_points": ["What happened", "Your ownership", "Lessons learned", "How you grew"],
            "common_mistakes": ["Blaming externals", "Not showing growth", "Fake failure"]
        },
        {
            "question": "How do you handle feedback?",
            "ideal_answer": "Explain your openness to feedback, how you process it, examples of acting on feedback, and how it helped you improve.",
            "key_points": ["Open mindset", "Processing feedback", "Taking action", "Growth example"],
            "common_mistakes": ["Being defensive", "No examples", "Saying you never get negative feedback"]
        },
        {
            "question": "Give an example of leadership.",
            "ideal_answer": "Describe a situation where you led (formally or informally), your approach, how you motivated others, and the outcome.",
            "key_points": ["Leadership context", "Your approach", "Team motivation", "Results"],
            "common_mistakes": ["No specific example", "Authoritative style only", "Taking all credit"]
        },
        {
            "question": "Describe a situation where you missed a deadline.",
            "ideal_answer": "Be honest, explain circumstances, what you did to mitigate, what you learned, and how you prevent it now.",
            "key_points": ["What happened", "Your actions", "Communication", "Learning"],
            "common_mistakes": ["Blaming others", "Not showing learning", "No prevention strategy"]
        },
        {
            "question": "How do you prioritize tasks?",
            "ideal_answer": "Explain your prioritization framework (urgency/importance matrix), tools you use, and give a real example.",
            "key_points": ["Framework/method", "Tools used", "Example", "Flexibility"],
            "common_mistakes": ["No clear method", "Too rigid", "No examples"]
        }
    ]
}

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if not user_data.consent:
        raise HTTPException(status_code=400, detail="Privacy consent required")
    
    user_id = str(uuid.uuid4())
    user_dict = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "role": Role.USER.value,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None,
        "total_interviews": 0,
        "average_score": 0.0,
        "streak": 0,
        "readiness_status": ReadinessStatus.NOT_READY.value
    }
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"sub": user_id, "email": user_data.email, "role": Role.USER.value})
    user_dict.pop("password", None)
    return TokenResponse(access_token=token, user=User(**user_dict))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    await db.users.update_one(
        {"email": login_data.email},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    user.pop("password", None)
    return TokenResponse(access_token=token, user=User(**user))

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["sub"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.post("/interviews/start", response_model=Interview)
async def start_interview(interview_data: InterviewStart, current_user: dict = Depends(get_current_user)):
    interview_id = str(uuid.uuid4())
    
    first_question = await ai_service.generate_question(
        interview_type=interview_data.interview_type,
        question_number=1,
        focus_area=interview_data.focus_area
    )
    
    interview_dict = {
        "id": interview_id,
        "user_id": current_user["sub"],
        "interview_type": interview_data.interview_type.value,
        "focus_area": interview_data.focus_area,
        "status": "in_progress",
        "started_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": None,
        "overall_score": None,
        "questions": [{
            "id": str(uuid.uuid4()),
            "question": first_question["question"],
            "difficulty": first_question.get("difficulty", "medium"),
            "number": 1
        }],
        "answers": []
    }
    
    await db.interviews.insert_one(interview_dict)
    return Interview(**interview_dict)

@api_router.post("/interviews/answer")
async def submit_answer(answer_data: AnswerSubmit, current_user: dict = Depends(get_current_user)):
    interview = await db.interviews.find_one(
        {"id": answer_data.interview_id, "user_id": current_user["sub"]},
        {"_id": 0}
    )
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    question = next((q for q in interview["questions"] if q["id"] == answer_data.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    evaluation = await ai_service.evaluate_answer(
        question=question["question"],
        answer=answer_data.answer_text,
        interview_type=InterviewType(interview["interview_type"])
    )
    
    answer_obj = {
        "question_id": answer_data.question_id,
        "question": question["question"],
        "answer": answer_data.answer_text,
        "score": evaluation["score"],
        "evaluation": evaluation,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    interview["answers"].append(answer_obj)
    
    next_question = None
    if len(interview["answers"]) < 5:
        next_question = await ai_service.generate_question(
            interview_type=InterviewType(interview["interview_type"]),
            question_number=len(interview["answers"]) + 1,
            previous_answers=interview["answers"],
            focus_area=interview.get("focus_area")
        )
        
        interview["questions"].append({
            "id": str(uuid.uuid4()),
            "question": next_question["question"],
            "difficulty": next_question.get("difficulty", "medium"),
            "number": len(interview["answers"]) + 1
        })
    
    await db.interviews.update_one(
        {"id": answer_data.interview_id},
        {"$set": {"questions": interview["questions"], "answers": interview["answers"]}}
    )
    
    return {
        "success": True,
        "evaluation": evaluation,
        "next_question": next_question,
        "is_complete": len(interview["answers"]) >= 5
    }

@api_router.post("/interviews/{interview_id}/complete")
async def complete_interview(interview_id: str, current_user: dict = Depends(get_current_user)):
    interview = await db.interviews.find_one(
        {"id": interview_id, "user_id": current_user["sub"]},
        {"_id": 0}
    )
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    if len(interview["answers"]) < 5:
        raise HTTPException(status_code=400, detail="Interview not complete")
    
    scores = [ans["score"] for ans in interview["answers"]]
    overall_score = sum(scores) / len(scores)
    
    breakdown = {
        "clarity": sum(ans["evaluation"]["clarity"] for ans in interview["answers"]) / len(interview["answers"]),
        "confidence": sum(ans["evaluation"]["confidence"] for ans in interview["answers"]) / len(interview["answers"]),
        "structure": sum(ans["evaluation"]["structure"] for ans in interview["answers"]) / len(interview["answers"]),
        "relevance": sum(ans["evaluation"]["relevance"] for ans in interview["answers"]) / len(interview["answers"])
    }
    
    weak_areas = []
    for key, value in breakdown.items():
        if value < 6.5:
            weak_areas.append(key.capitalize())
    
    strengths = []
    for key, value in breakdown.items():
        if value >= 8.0:
            strengths.append(f"Strong {key}")
    
    if not strengths:
        strengths = ["Completed the interview", "Attempted all questions"]
    
    mistakes = []
    tips = []
    
    for ans in interview["answers"]:
        if ans["score"] < 7.0:
            feedback = await ai_service.generate_feedback(
                question=ans["question"],
                user_answer=ans["answer"],
                score=ans["score"]
            )
            
            if feedback.get("mistakes"):
                mistakes.extend(feedback["mistakes"][:1])
            if feedback.get("tips"):
                tips.extend(feedback["tips"][:1])
    
    if not tips:
        tips = ["Practice STAR method", "Use specific examples", "Be concise and structured"]
    
    tips = list(set(tips))[:3]
    mistakes = mistakes[:3]
    
    if overall_score >= 8.0:
        readiness = ReadinessStatus.READY
    elif overall_score >= 6.0:
        readiness = ReadinessStatus.NEEDS_PRACTICE
    else:
        readiness = ReadinessStatus.NOT_READY
    
    evaluation_id = str(uuid.uuid4())
    evaluation_dict = {
        "id": evaluation_id,
        "interview_id": interview_id,
        "user_id": current_user["sub"],
        "overall_score": round(overall_score, 2),
        "breakdown": {k: round(v, 2) for k, v in breakdown.items()},
        "strengths": strengths,
        "mistakes": mistakes,
        "improvement_tips": tips,
        "readiness_flag": readiness.value,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.evaluations.insert_one(evaluation_dict)
    
    await db.interviews.update_one(
        {"id": interview_id},
        {"$set": {
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "overall_score": round(overall_score, 2)
        }}
    )
    
    user = await db.users.find_one({"id": current_user["sub"]}, {"_id": 0})
    total_interviews = user["total_interviews"] + 1
    new_avg = ((user["average_score"] * user["total_interviews"]) + overall_score) / total_interviews
    
    await db.users.update_one(
        {"id": current_user["sub"]},
        {"$set": {
            "total_interviews": total_interviews,
            "average_score": round(new_avg, 2),
            "readiness_status": readiness.value
        }}
    )
    
    return Evaluation(**evaluation_dict)

@api_router.get("/interviews/history")
async def get_interview_history(current_user: dict = Depends(get_current_user)):
    interviews = await db.interviews.find(
        {"user_id": current_user["sub"]},
        {"_id": 0}
    ).sort("started_at", -1).to_list(100)
    
    return interviews

@api_router.get("/evaluations/{interview_id}")
async def get_evaluation(interview_id: str, current_user: dict = Depends(get_current_user)):
    evaluation = await db.evaluations.find_one(
        {"interview_id": interview_id, "user_id": current_user["sub"]},
        {"_id": 0}
    )
    
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    interview = await db.interviews.find_one({"id": interview_id}, {"_id": 0})
    
    detailed_feedback = []
    for ans in interview.get("answers", []):
        feedback = await ai_service.generate_feedback(
            question=ans["question"],
            user_answer=ans["answer"],
            score=ans["score"]
        )
        
        detailed_feedback.append({
            "question": ans["question"],
            "your_answer": ans["answer"],
            "score": ans["score"],
            "improved_answer": feedback.get("improved_answer", ""),
            "why_improved": feedback.get("why_improved", ""),
            "mistakes": feedback.get("mistakes", [])
        })
    
    evaluation["detailed_feedback"] = detailed_feedback
    return evaluation

@api_router.get("/analytics/dashboard")
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["sub"]}, {"_id": 0})
    
    interviews = await db.interviews.find(
        {"user_id": current_user["sub"], "status": "completed"},
        {"_id": 0}
    ).sort("completed_at", 1).to_list(100)
    
    growth_data = []
    for interview in interviews:
        if interview.get("overall_score"):
            growth_data.append({
                "date": interview["completed_at"][:10],
                "score": interview["overall_score"],
                "type": interview["interview_type"]
            })
    
    weak_areas = {}
    for interview in interviews:
        for ans in interview.get("answers", []):
            weakness = ans.get("evaluation", {}).get("weakness_identified", "")
            if weakness:
                weak_areas[weakness] = weak_areas.get(weakness, 0) + 1
    
    top_weak_areas = sorted(weak_areas.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return {
        "overall_score": user["average_score"],
        "total_interviews": user["total_interviews"],
        "streak": user["streak"],
        "readiness_status": user["readiness_status"],
        "growth_data": growth_data,
        "weak_areas": [{"area": area, "count": count} for area, count in top_weak_areas]
    }

@api_router.get("/practice/questions/{category}")
async def get_practice_questions(category: InterviewType):
    questions = QUESTION_BANK.get(category, [])
    return [
        {
            "id": str(uuid.uuid4()),
            "category": category.value,
            **q
        }
        for q in questions
    ]

@api_router.get("/admin/dashboard", dependencies=[Depends(require_admin)])
async def get_admin_dashboard():
    total_users = await db.users.count_documents({"role": Role.USER.value})
    
    users = await db.users.find({"role": Role.USER.value}, {"_id": 0}).to_list(1000)
    
    ready_count = sum(1 for u in users if u.get("readiness_status") == ReadinessStatus.READY.value)
    needs_practice = sum(1 for u in users if u.get("readiness_status") == ReadinessStatus.NEEDS_PRACTICE.value)
    
    top_performers = sorted(users, key=lambda x: x.get("average_score", 0), reverse=True)[:5]
    weak_candidates = sorted([u for u in users if u.get("total_interviews", 0) > 0], key=lambda x: x.get("average_score", 0))[:5]
    
    week_ago = (datetime.now(timezone.utc).timestamp() - 7 * 24 * 3600)
    active_this_week = 0
    for u in users:
        if u.get("last_login"):
            try:
                login_time = datetime.fromisoformat(u["last_login"]).timestamp()
                if login_time > week_ago:
                    active_this_week += 1
            except:
                pass
    
    if not users:
        avg_score = 0
    else:
        scores = [u.get("average_score", 0) for u in users if u.get("total_interviews", 0) > 0]
        avg_score = sum(scores) / len(scores) if scores else 0
    
    return {
        "total_users": total_users,
        "ready_for_interview": ready_count,
        "needs_practice": needs_practice,
        "active_this_week": active_this_week,
        "average_score": round(avg_score, 2),
        "top_performers": top_performers,
        "weak_candidates": weak_candidates
    }

@api_router.get("/admin/users", dependencies=[Depends(require_admin)])
async def get_all_users():
    users = await db.users.find({"role": Role.USER.value}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.get("/admin/users/{user_id}", dependencies=[Depends(require_admin)])
async def get_user_detail(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    interviews = await db.interviews.find(
        {"user_id": user_id, "status": "completed"},
        {"_id": 0}
    ).sort("completed_at", 1).to_list(100)
    
    growth_data = []
    for interview in interviews:
        if interview.get("overall_score"):
            growth_data.append({
                "date": interview["completed_at"][:10],
                "score": interview["overall_score"],
                "type": interview["interview_type"]
            })
    
    weak_areas = {}
    for interview in interviews:
        for ans in interview.get("answers", []):
            weakness = ans.get("evaluation", {}).get("weakness_identified", "")
            if weakness:
                weak_areas[weakness] = weak_areas.get(weakness, 0) + 1
    
    top_weak_areas = sorted(weak_areas.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "user": user,
        "interviews": interviews,
        "growth_data": growth_data,
        "weak_areas": [{"area": area, "count": count} for area, count in top_weak_areas]
    }

@api_router.get("/admin/insights", dependencies=[Depends(require_admin)])
async def get_platform_insights():
    all_interviews = await db.interviews.find({"status": "completed"}, {"_id": 0}).to_list(1000)
    
    all_weak_areas = {}
    failed_questions = {}
    confidence_dist = {"high": 0, "medium": 0, "low": 0}
    
    for interview in all_interviews:
        for ans in interview.get("answers", []):
            eval_data = ans.get("evaluation", {})
            weakness = eval_data.get("weakness_identified", "")
            if weakness:
                all_weak_areas[weakness] = all_weak_areas.get(weakness, 0) + 1
            
            score = ans.get("score", 0)
            if score < 5:
                q_text = ans.get("question", "Unknown Question")
                failed_questions[q_text] = failed_questions.get(q_text, 0) + 1
            
            conf = eval_data.get("confidence", 0)
            if conf >= 8: confidence_dist["high"] += 1
            elif conf >= 5: confidence_dist["medium"] += 1
            else: confidence_dist["low"] += 1
    
    common_mistakes = sorted(all_weak_areas.items(), key=lambda x: x[1], reverse=True)[:10]
    most_failed = sorted(failed_questions.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "common_mistakes": [{"mistake": m, "frequency": f} for m, f in common_mistakes],
        "most_failed_questions": [{"question": q, "count": c} for q, c in most_failed],
        "confidence_distribution": confidence_dist,
        "total_interviews": len(all_interviews)
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Ensure default admin user exists
    admin_email = "admin@interviewiq.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        user_id = str(uuid.uuid4())
        admin_dict = {
            "id": user_id,
            "email": admin_email,
            "password": hash_password("admin123"),
            "name": "Platform Admin",
            "role": Role.ADMIN.value,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None,
            "total_interviews": 0,
            "average_score": 0.0,
            "streak": 0,
            "readiness_status": ReadinessStatus.NOT_READY.value,
            "consent": True
        }
        await db.users.insert_one(admin_dict)
        logger.info(f"Default admin user created: {admin_email}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
