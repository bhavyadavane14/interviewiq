import os
import json
from typing import List, Dict, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
from models import InterviewType

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
    
    async def generate_question(self, interview_type: InterviewType, question_number: int, 
                               previous_answers: List[Dict] = None, focus_area: str = None) -> Dict[str, str]:
        """Generate adaptive interview question"""
        
        context = f"Interview Type: {interview_type}\n"
        context += f"Question Number: {question_number}\n"
        
        if focus_area:
            context += f"Focus Area: {focus_area}\n"
        
        if previous_answers:
            context += "\nPrevious Performance:\n"
            for i, ans in enumerate(previous_answers, 1):
                context += f"Q{i}: {ans.get('question', '')}\n"
                context += f"Score: {ans.get('score', 'N/A')}/10\n"
        
        prompt = f"""{context}

Generate an adaptive interview question. Return ONLY valid JSON in this exact format:
{{
    "question": "The interview question here",
    "difficulty": "easy|medium|hard",
    "expected_elements": ["element1", "element2"]
}}

Rules:
- For {interview_type} interviews
- Adjust difficulty based on previous performance
- Make it relevant and realistic
- Return ONLY the JSON object, no other text"""
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"question_gen_{question_number}",
            system_message="You are an expert interview question generator. Always return valid JSON only."
        ).with_model("openai", "gpt-4o")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        try:
            return json.loads(response)
        except:
            return {
                "question": self._get_fallback_question(interview_type, question_number),
                "difficulty": "medium",
                "expected_elements": ["clarity", "relevance"]
            }
    
    async def evaluate_answer(self, question: str, answer: str, interview_type: InterviewType) -> Dict[str, Any]:
        """Evaluate candidate answer with explainable feedback"""
        
        prompt = f"""Evaluate this interview answer:

Question: {question}
Answer: {answer}
Interview Type: {interview_type}

Provide evaluation in ONLY valid JSON format:
{{
    "score": 7.5,
    "clarity": 8.0,
    "confidence": 7.0,
    "structure": 7.5,
    "relevance": 8.0,
    "explanation": "Brief explanation of score",
    "weakness_identified": "Main weakness",
    "explainability_tags": [
        "Low confidence due to hesitation",
        "Structure weak (no STAR method)",
        "Good relevance, poor clarity"
    ]
}}

Return ONLY the JSON object, no other text."""
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"eval_{hash(answer)}",
            system_message="You are an expert interview evaluator. Always return valid JSON only."
        ).with_model("openai", "gpt-4o")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        try:
            return json.loads(response)
        except:
            return {
                "score": 6.5,
                "clarity": 6.5,
                "confidence": 6.5,
                "structure": 6.5,
                "relevance": 6.5,
                "explanation": "Answer provided with moderate clarity",
                "weakness_identified": "Structure and confidence"
            }
    
    async def generate_feedback(self, question: str, user_answer: str, score: float) -> Dict[str, Any]:
        """Generate comprehensive feedback with corrections"""
        
        prompt = f"""Generate feedback for this interview answer:

Question: {question}
Candidate's Answer: {user_answer}
Score: {score}/10

Provide feedback in ONLY valid JSON format:
{{
    "strengths": ["strength1", "strength2"],
    "mistakes": [
        {{"what_went_wrong": "issue", "correction": "how to fix it"}}
    ],
    "improved_answer": "A better version of the answer",
    "why_improved": "Explanation of improvements",
    "tips": ["tip1", "tip2", "tip3"]
}}

Return ONLY the JSON object, no other text."""
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"feedback_{hash(user_answer)}",
            system_message="You are an expert interview coach. Always return valid JSON only."
        ).with_model("openai", "gpt-5.2")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        try:
            return json.loads(response)
        except:
            return {
                "strengths": ["Attempted to answer", "Showed some understanding"],
                "mistakes": [{"what_went_wrong": "Lacked structure", "correction": "Use STAR method"}],
                "improved_answer": "Consider structuring your answer with clear examples",
                "why_improved": "Better structure helps communicate your experience",
                "tips": ["Practice STAR method", "Use specific examples", "Be concise"],
                "explainability_tags": ["Structure weak (no STAR method)"]
            }
    
    def _get_fallback_question(self, interview_type: InterviewType, number: int) -> str:
        """Fallback questions if AI fails"""
        questions = {
            InterviewType.HR: [
                "Tell me about yourself.",
                "What are your strengths and weaknesses?",
                "Why should we hire you?",
                "Describe a challenge you faced and how you handled it.",
                "How do you handle pressure and deadlines?"
            ],
            InterviewType.TECHNICAL: [
                "Explain a project you have worked on.",
                "What is the difference between stack and queue?",
                "What is an API and why is it used?",
                "How do you debug an application?",
                "Explain one technology you are confident in."
            ],
            InterviewType.BEHAVIORAL: [
                "Describe a time you worked in a team.",
                "Tell me about a conflict you faced and how you resolved it.",
                "Describe a failure and what you learned from it.",
                "How do you handle feedback?",
                "Give an example of leadership."
            ]
        }
        q_list = questions.get(interview_type, questions[InterviewType.HR])
        return q_list[(number - 1) % len(q_list)]