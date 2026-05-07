import random

class AIService:
    async def generate_question(self, interview_type, question_number, focus_area=None, previous_answers=None):
        # Fallback questions if LLM is not configured or fails
        fallbacks = {
            "HR": [
                "Tell me about a time you handled a difficult situation.",
                "Why do you want to work for our company?",
                "Where do you see yourself in five years?"
            ],
            "Technical": [
                f"Explain the core concepts of {focus_area or 'Software Development'}.",
                "How do you ensure code quality in your projects?",
                "Describe a complex technical challenge you solved recently."
            ],
            "Behavioral": [
                "How do you handle conflict within a team?",
                "Describe a situation where you had to meet a tight deadline.",
                "Give an example of a time you showed leadership."
            ]
        }
        
        category = str(interview_type)
        if "HR" in category: cat = "HR"
        elif "Technical" in category: cat = "Technical"
        else: cat = "Behavioral"
        
        questions = fallbacks.get(cat, fallbacks["HR"])
        question = random.choice(questions)
        
        return {
            "question": question,
            "difficulty": "medium",
            "topic": focus_area or "General"
        }

    async def evaluate_answer(self, question, answer, interview_type):
        # Mock evaluation logic - in a real app, this would call GPT/Gemini
        score = random.uniform(6.5, 9.5)
        return {
            "score": round(score, 1),
            "clarity": round(random.uniform(7, 10), 1),
            "confidence": round(random.uniform(6, 9), 1),
            "structure": round(random.uniform(7, 9), 1),
            "relevance": round(random.uniform(8, 10), 1),
            "feedback": "Good attempt at answering the question. You covered the main points.",
            "weakness_identified": "Could provide more specific examples" if score < 8 else None
        }

    async def generate_feedback(self, question, user_answer, score):
        return {
            "mistakes": ["Needs more technical depth", "Avoid filler words"],
            "tips": ["Use the STAR method", "Connect your answer to the job role"],
            "improved_answer": "An improved version of your answer would include specific metrics and outcomes.",
            "why_improved": "This version is more impact-oriented and structured.",
            "mistakes": ["Vague descriptions"]
        }
