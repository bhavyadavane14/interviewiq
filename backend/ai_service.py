import random
import re

# ─── Ideal answer keywords per topic ────────────────────────────────────────
IDEAL_KEYWORDS = {
    # HR questions
    "five years": ["growth", "leadership", "senior", "expertise", "contribution", "career", "skills", "team", "goals"],
    "difficult situation": ["resolved", "communicated", "listened", "solution", "outcome", "challenge", "approach", "team", "result"],
    "why do you want": ["mission", "values", "culture", "skills", "contribute", "align", "growth", "excited", "passionate", "impact"],
    "strength": ["detail", "leadership", "communication", "analytical", "teamwork", "problem-solving", "organized", "creative"],
    "weakness": ["improving", "working on", "learning", "awareness", "action", "feedback", "growth"],
    "conflict": ["listened", "mediated", "resolved", "compromise", "respect", "communication", "outcome", "team"],
    "leadership": ["motivated", "delegated", "guided", "team", "goal", "result", "accountability", "vision"],
    "deadline": ["prioritized", "organized", "delivered", "communicated", "efficient", "plan", "result"],
    # Technical questions
    "code quality": ["testing", "review", "clean code", "unit test", "documentation", "SOLID", "refactor", "lint", "CI/CD"],
    "software development": ["agile", "version control", "git", "API", "architecture", "debug", "deploy", "scalable"],
    "technical challenge": ["diagnosed", "researched", "implemented", "tested", "optimized", "scalable", "solution", "performance"],
    "algorithm": ["complexity", "O(n)", "optimize", "data structure", "time complexity", "space", "efficient"],
    "database": ["query", "index", "normalization", "JOIN", "transaction", "schema", "ORM", "SQL", "NoSQL"],
    "api": ["REST", "endpoint", "JSON", "authentication", "token", "rate limit", "versioning", "HTTP"],
    # Behavioral
    "teamwork": ["collaborated", "communicated", "contributed", "supported", "shared", "goal", "outcome"],
    "failure": ["learned", "improved", "accountability", "reflection", "growth", "corrected", "took responsibility"],
    "success": ["achieved", "delivered", "impact", "result", "quantifiable", "team", "goal"],
}

# ─── Ideal answer templates per question ────────────────────────────────────
IDEAL_ANSWERS = {
    "where do you see yourself in five years": (
        "In five years, I aim to have grown into a senior/lead role where I can mentor junior team members "
        "and contribute to architectural decisions. I plan to deepen my expertise in [relevant skill], "
        "take on larger projects, and align my growth with the company's long-term goals. "
        "**Key words: leadership, expertise, contribution, growth, goals.**"
    ),
    "tell me about a time you handled a difficult situation": (
        "In my previous role, I faced [specific challenge, e.g., 'a production outage 2 hours before launch']. "
        "I immediately communicated with stakeholders, triaged the issue, and delegated tasks to the team. "
        "Within 3 hours we resolved it and introduced a monitoring system to prevent recurrence. "
        "**Key words: communicated, resolved, delegated, outcome, result, proactive.**"
    ),
    "why do you want to work for our company": (
        "I admire your company's mission to [X] and its culture of [Y]. My skills in [Z] align directly "
        "with the problems your team is solving. I'm excited to contribute to [specific product/goal] "
        "and grow alongside a team that values [innovation/collaboration/impact]. "
        "**Key words: mission, values, contribute, align, excited, impact.**"
    ),
    "how do you handle conflict within a team": (
        "I first listen to all perspectives without judgment, then identify the root cause of the disagreement. "
        "I facilitate a conversation where both sides can express concerns and work toward a shared solution. "
        "For example, [brief scenario]. The outcome was [positive result]. "
        "**Key words: listened, communicated, mediated, resolved, respect, outcome.**"
    ),
    "describe a situation where you had to meet a tight deadline": (
        "I prioritized tasks using MoSCoW (Must/Should/Could/Won't), communicated timeline risks early, "
        "and focused the team's efforts on the critical path. We delivered the project on time by cutting "
        "non-essential features and automating repetitive steps. "
        "**Key words: prioritized, organized, communicated, delivered, efficient.**"
    ),
    "explain the core concepts of software development": (
        "Core concepts include: Agile/Scrum methodology for iterative delivery, version control (Git) for "
        "collaboration, SOLID principles for clean code, unit and integration testing for quality, CI/CD pipelines "
        "for deployment, and scalable architecture patterns like microservices or MVC. "
        "**Key words: agile, git, SOLID, testing, CI/CD, scalable, architecture.**"
    ),
    "how do you ensure code quality in your projects": (
        "I follow a multi-layer approach: (1) Write unit and integration tests with >80% coverage, "
        "(2) Conduct peer code reviews, (3) Use linters and formatters (ESLint, Prettier), "
        "(4) Follow SOLID principles, (5) Use CI/CD to run automated tests on every PR. "
        "**Key words: unit test, code review, linter, SOLID, CI/CD, documentation.**"
    ),
    "describe a complex technical challenge you solved recently": (
        "I faced [specific issue, e.g., 'a memory leak in our Node.js API causing crashes under load']. "
        "I used profiling tools to diagnose the root cause, implemented object pooling and fixed the leak, "
        "then load-tested with 10k concurrent users to verify. Response time improved by 60%. "
        "**Key words: diagnosed, profiled, implemented, tested, optimized, measurable result.**"
    ),
    "give an example of a time you showed leadership": (
        "When our team lead left mid-project, I stepped up to coordinate daily standups, clarify requirements "
        "with stakeholders, and unblock team members. I created a shared roadmap and we delivered the sprint "
        "on time. Post-project, the team rated collaboration 9/10. "
        "**Key words: motivated, delegated, guided, accountable, delivered, result.**"
    ),
}

class AIService:
    def _get_ideal_answer(self, question: str) -> str:
        q_lower = question.lower()
        for key, answer in IDEAL_ANSWERS.items():
            if key in q_lower:
                return answer
        # Fallback: find closest keyword match
        return (
            f"A strong answer to '{question}' should: (1) Directly address the question in your first sentence, "
            f"(2) Use the STAR method — Situation, Task, Action, Result — with specific examples, "
            f"(3) Quantify outcomes where possible (e.g. 'improved performance by 40%'), "
            f"(4) Close with what you learned or how it prepared you for future challenges. "
            f"**Key words: specific example, result, impact, quantifiable, structured.**"
        )

    def _score_answer(self, question: str, answer: str) -> dict:
        answer_lower = answer.lower().strip()
        q_lower = question.lower()

        # ── 1. Reject gibberish / empty ──────────────────────────────────────
        words = answer_lower.split()
        word_count = len(words)
        unique_words = len(set(words))
        alpha_ratio = sum(c.isalpha() for c in answer) / max(len(answer), 1)

        # Gibberish: mostly non-alpha, or very few unique words vs total (repeated spam)
        if (
            word_count < 5
            or alpha_ratio < 0.6
            or (word_count > 5 and unique_words / word_count < 0.4)
        ):
            return {"score": 1.0, "clarity": 1.0, "confidence": 1.0,
                    "structure": 1.0, "relevance": 1.0,
                    "feedback": "This answer appears to be gibberish or too brief. Please provide a meaningful response.",
                    "weakness_identified": "Non-responsive / gibberish answer"}

        # ── 2. Length score (min 30 words expected) ───────────────────────────
        length_score = min(word_count / 30, 1.0)  # 0→1 at 30+ words

        # ── 3. Keyword relevance score ────────────────────────────────────────
        matched_keywords = 0
        total_keywords = 0
        for topic, kws in IDEAL_KEYWORDS.items():
            if topic in q_lower:
                matched = sum(1 for kw in kws if kw.lower() in answer_lower)
                matched_keywords += matched
                total_keywords += len(kws)
        keyword_score = (matched_keywords / total_keywords) if total_keywords > 0 else 0.3

        # ── 4. Structure score (sentences, punctuation) ───────────────────────
        sentences = [s.strip() for s in re.split(r'[.!?]', answer) if s.strip()]
        has_multiple_sentences = len(sentences) >= 2
        has_specifics = any(c.isdigit() for c in answer)  # numbers = specific examples
        structure_score = (0.5 + 0.3 * has_multiple_sentences + 0.2 * has_specifics)

        # ── 5. Combine into final score (0–10) ────────────────────────────────
        raw = (length_score * 0.35) + (keyword_score * 0.40) + (structure_score * 0.25)
        final_score = round(2.0 + raw * 8.0, 1)  # Scale: min 2, max 10
        final_score = max(1.0, min(10.0, final_score))

        # ── 6. Sub-scores ─────────────────────────────────────────────────────
        clarity    = round(min(10, 3 + length_score * 5 + random.uniform(-0.5, 0.5)), 1)
        confidence = round(min(10, 3 + structure_score * 5 + random.uniform(-0.5, 0.5)), 1)
        structure  = round(min(10, 3 + structure_score * 6 + random.uniform(-0.5, 0.5)), 1)
        relevance  = round(min(10, 2 + keyword_score * 8 + random.uniform(-0.5, 0.5)), 1)

        return {
            "score": final_score,
            "clarity": clarity,
            "confidence": confidence,
            "structure": structure,
            "relevance": relevance,
            "feedback": (
                "Excellent answer with strong structure and relevant details." if final_score >= 8 else
                "Decent attempt but could use more specific examples and measurable outcomes." if final_score >= 5 else
                "Answer lacks depth, relevance, or meaningful content. Use keywords and the STAR method."
            ),
            "weakness_identified": (
                None if final_score >= 8 else
                "Missing specific examples and quantifiable results" if final_score >= 5 else
                "Answer does not meaningfully address the question"
            )
        }

    async def generate_question(self, interview_type, question_number, focus_area=None, previous_answers=None):
        fallbacks = {
            "HR": [
                "Tell me about yourself and why you're a great fit for this role.",
                "Where do you see yourself in five years?",
                "Tell me about a time you handled a difficult situation.",
                "Why do you want to work for our company?",
                "What is your greatest strength and weakness?",
            ],
            "Technical": [
                f"Explain the core concepts of {focus_area or 'Software Development'}.",
                "How do you ensure code quality in your projects?",
                "Describe a complex technical challenge you solved recently.",
                "How would you design a scalable REST API?",
                "Explain the difference between SQL and NoSQL databases.",
            ],
            "Behavioral": [
                "How do you handle conflict within a team?",
                "Describe a situation where you had to meet a tight deadline.",
                "Give an example of a time you showed leadership.",
                "Tell me about a project you're most proud of and why.",
                "Describe a time you failed and what you learned from it.",
            ]
        }

        category = str(interview_type)
        if "HR" in category: cat = "HR"
        elif "Technical" in category: cat = "Technical"
        else: cat = "Behavioral"

        questions = fallbacks.get(cat, fallbacks["HR"])
        # Use question_number to cycle through questions, avoid repeats
        idx = (question_number - 1) % len(questions)
        question = questions[idx]

        return {
            "question": question,
            "difficulty": "medium",
            "topic": focus_area or "General"
        }

    async def evaluate_answer(self, question, answer, interview_type):
        return self._score_answer(question, answer)

    async def generate_feedback(self, question, user_answer, score):
        ideal = self._get_ideal_answer(question)

        if score < 3.0:
            mistakes = [
                {"what_went_wrong": "The answer is gibberish or completely off-topic.", "correction": "Read the question carefully and respond with a real example from your experience."},
                {"what_went_wrong": "No relevant keywords or structure detected.", "correction": "Use the STAR method: Situation → Task → Action → Result."},
            ]
            tips = ["Always address the question directly", "Use real examples from your experience", "Structure your answer with STAR method"]
        elif score < 5.0:
            mistakes = [
                {"what_went_wrong": "Answer is too short or lacks specific detail.", "correction": "Expand with a concrete example and quantify the outcome (e.g. 'improved performance by 30%')."},
                {"what_went_wrong": "Missing relevant keywords for this topic.", "correction": "Include domain-specific terms that show your understanding."},
            ]
            tips = ["Add specific examples", "Quantify outcomes where possible", "Use STAR structure"]
        elif score < 7.5:
            mistakes = [
                {"what_went_wrong": "Good start, but missing clear outcomes or results.", "correction": "Always end your answer with the measurable impact or result of your actions."},
                {"what_went_wrong": "Could be more specific with numbers or metrics.", "correction": "Replace vague phrases like 'improved things' with 'reduced latency by 40%'."},
            ]
            tips = ["Quantify your results", "Practice concise STAR answers", "Add industry keywords"]
        else:
            mistakes = []
            tips = ["Keep practicing structured storytelling", "Focus on quantifiable results", "Maintain confident delivery"]

        return {
            "mistakes": mistakes,
            "tips": tips,
            "improved_answer": ideal,
            "why_improved": "This version uses relevant keywords, specific examples, and quantifiable outcomes — exactly what interviewers look for."
        }

ai_service = AIService()
