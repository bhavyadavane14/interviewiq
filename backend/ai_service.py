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
        # Basic check for gibberish or extremely short answers
        if len(answer.strip()) < 10 or not any(c.isalpha() for c in answer):
            return {
                "score": 1.0,
                "clarity": 1.0,
                "confidence": 1.0,
                "structure": 1.0,
                "relevance": 1.0,
                "feedback": "This answer is non-sensical or too brief. Please provide a meaningful response to the question.",
                "weakness_identified": "Invalid or non-responsive answer"
            }

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
        # Specific feedback based on score
        if score < 5.0:
            mistakes = [
                {"what_went_wrong": "The answer was too brief and lacked specific details.", "correction": "Use the STAR method to provide a structured, detailed response."},
                {"what_went_wrong": "Failed to address the core of the question.", "correction": "Listen carefully to the prompt and ensure your first sentence directly answers it."}
            ]
        elif score < 7.5:
            mistakes = [
                {"what_went_wrong": "Good start, but missing clear outcomes or results.", "correction": "Always conclude your answer with the impact or result of your actions."},
                {"what_went_wrong": "Used some filler words like 'um' or 'basically'.", "correction": "Pause briefly to think instead of using filler words."}
            ]
        else:
            mistakes = []

        return {
            "mistakes": mistakes,
            "tips": ["Practice structured storytelling", "Focus on quantifiable results", "Maintain better eye contact simulation"],
            "improved_answer": f"A more complete answer to '{question}' would be: 'In my previous role, I encountered [Situation]. I was responsible for [Task]. I implemented [Action], which resulted in [Result].'",
            "why_improved": "This version follows the STAR method and provides clear, measurable outcomes."
        }
