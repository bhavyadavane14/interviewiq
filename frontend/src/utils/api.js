<<<<<<< HEAD
import axios from "axios";

// ✅ Correct for Create React App
const BACKEND_URL = process.env.REACT_APP_API_URL;

if (!BACKEND_URL) {
  console.error("REACT_APP_API_URL is NOT defined");
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

=======
// MOCKED API IMPLEMENTATION FOR LOCAL TESTING
// I have backed up the real api.js to api_real.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockUser = {
  id: "mock-user-123",
  email: "candidate@example.com",
  name: "Success Candidate",
  role: "user",
  total_interviews: 0,
  average_score: 0,
  streak: 1,
  readiness_status: "Not Ready"
};

const mockAdmin = {
  id: "mock-admin-123",
  email: "admin@interviewiq.com",
  name: "InterviewIQ Admin",
  role: "admin",
  total_interviews: 0,
  average_score: 0,
  streak: 0,
  readiness_status: "Not Ready"
};

// Internal state to track mock interview progress
let currentAnswersCount = 0;

export const authAPI = {
  signup: async (data) => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem("mock_users_list") || "[]");
    
    if (users.find(u => u.email === data.email)) {
       // User already exists, but we'll just update it for the mock
    } else {
      users.push({ email: data.email, name: data.name });
      localStorage.setItem("mock_users_list", JSON.stringify(users));
    }

    const user = data.email === "admin@interviewiq.com" ? mockAdmin : { ...mockUser, email: data.email, name: data.name };
    localStorage.setItem("mock_user", JSON.stringify(user));
    return { data: { access_token: "mock-token-123", user } };
  },
  login: async (data) => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem("mock_users_list") || "[]");
    const exists = users.find(u => u.email === data.email) || data.email === "admin@interviewiq.com";

    if (!exists) {
      throw { response: { data: { detail: "Account not found. Please create an account first." } } };
    }

    const user = data.email === "admin@interviewiq.com" ? mockAdmin : { ...mockUser, email: data.email, name: users.find(u => u.email === data.email)?.name || "User" };
    localStorage.setItem("mock_user", JSON.stringify(user));
    return { data: { access_token: "mock-token-123", user } };
  },
  getMe: async () => {
    await delay(500);
    const user = JSON.parse(localStorage.getItem("mock_user")) || mockUser;
    return { data: user };
  },
};

export const interviewAPI = {
  start: async (data) => {
    await delay(1200);
    currentAnswersCount = 0;
    const newInterview = {
      id: "interview-" + Math.random().toString(36).substr(2, 9),
      interview_type: data.interview_type || "HR",
      focus_area: data.focus_area || "General",
      status: "in_progress",
      questions: [{ id: "q1", question: `Welcome! Let's start the ${data.interview_type} interview with a focus on ${data.focus_area || 'General skills'}. To begin, tell me about your experience in this field and what key challenges you've faced recently.`, difficulty: "medium", number: 1 }],
      answers: [],
      started_at: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    history.push(newInterview);
    localStorage.setItem("mock_interview_history", JSON.stringify(history));

    return { data: newInterview };
  },
  submitAnswer: async (data) => {
    await delay(1800);
    currentAnswersCount++;
    
    const focus = data.focus_area || "this area";
    const questions = [
      `That's a good start. Can you tell me more about a specific project involving ${focus} that you are particularly proud of?`,
      `How did you ensure quality and consistency while working on ${focus} in that project?`,
      `Interviews often touch on teamwork. How do you handle disagreements with colleagues regarding ${focus}?`,
      `Can you describe a time when you had to learn a new concept in ${focus} very quickly?`,
      `Let's dive deeper. What are the most common pitfalls you see professionals making in ${focus}?`,
      `How do you stay updated with the latest trends and changes within ${focus}?`,
      `Tell me about a time you had to explain a complex ${focus} concept to a non-technical stakeholder.`,
      `In a high-pressure situation involving ${focus}, how do you prioritize your tasks?`,
      `Finally, what is the one thing about ${focus} that you think is most misunderstood by others in the industry?`
    ];

    const isComplete = currentAnswersCount >= 10;
    const nextQuestion = isComplete ? null : { 
      id: `q${currentAnswersCount + 1}`, 
      question: questions[currentAnswersCount - 1] || `Tell me more about your experience with ${focus}.`, 
      difficulty: currentAnswersCount > 7 ? "hard" : currentAnswersCount > 4 ? "medium" : "easy" 
    };

    // Update history with the answer
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    const interview = history.find(i => i.id === data.interview_id);
    if (interview) {
      interview.answers.push({ question_id: data.question_id, answer_text: data.answer_text });
      if (nextQuestion) interview.questions.push(nextQuestion);
      localStorage.setItem("mock_interview_history", JSON.stringify(history));
    }

    return {
      data: {
        success: true,
        is_complete: isComplete,
        next_question: nextQuestion,
        evaluation: {
          score: Math.floor(Math.random() * 3) + 7,
          clarity: 8,
          confidence: 7,
          structure: 9,
          relevance: 8,
          feedback: `Your explanation of ${focus} was solid. Try to use more specific metrics next time.`
        }
      }
    };
  },
  complete: async (interviewId) => {
    await delay(1500);
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    const interview = history.find(i => i.id === interviewId);
    if (interview) {
      interview.status = "completed";
      interview.completed_at = new Date().toISOString();
      interview.overall_score = 8.4;
      localStorage.setItem("mock_interview_history", JSON.stringify(history));
    }

    return {
      data: {
        id: interviewId,
        overall_score: 8.4,
        breakdown: { clarity: 8.5, confidence: 7.8, structure: 9.0, relevance: 8.2 },
        strengths: ["Strong domain knowledge", "Clear articulation", "STAR method usage"],
        mistakes: [{ what_went_wrong: "Verbose in situation phase", correction: "Keep it brisk" }],
        improvement_tips: ["Practice case studies", "Work on summary statements"],
        explainability_tags: ["Focus Area Expert", "Technically Fluent"],
        readiness_flag: "Ready"
      }
    };
  },
  getHistory: async () => {
    await delay(800);
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    return { data: history };
  },
};

export const evaluationAPI = {
  get: async (interviewId) => {
    await delay(1000);
    return {
      data: {
        overall_score: 8.4,
        breakdown: { clarity: 8.5, confidence: 7.8, structure: 9.0, relevance: 8.2 },
        strengths: ["STAR Method Mastery", "Technical Depth", "Concise Delivery"],
        mistakes: [
          { what_went_wrong: "Slight hesitation on scaling questions", correction: "Review load balancing strategies" }
        ],
        improvement_tips: ["Focus on database sharding concepts", "Maintain consistent eye contact in video mocks"],
        detailed_feedback: [
          { 
            question: "Tell me about a difficult technical challenge.", 
            your_answer: "I had to fix a memory leak in a production Node.js service. I used heap dumps to find the culprit.", 
            score: 8, 
            explainability_tags: ["Direct", "Action-Oriented"],
            improved_answer: "In my previous role, I identified a critical memory leak in our high-traffic Node.js service. By analyzing heap dumps and using Chrome DevTools, I traced the issue to an unclosed database connection. I implemented a proper cleanup listener, which reduced memory usage by 40%.",
            why_improved: "Quantifying the result (40% reduction) makes the impact much clearer to the interviewer."
          }
        ],
        explainability_tags: ["STAR Method Expert", "Impact Driven"],
        readiness_flag: "Ready"
      }
    };
  },
};

export const analyticsAPI = {
  getDashboard: async () => {
    await delay(1000);
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    
    // Calculate dynamic stats
    const totalInterviews = history.length;
    const completedInterviews = history.filter(i => i.status === 'completed');
    const overallScore = completedInterviews.length > 0 
      ? completedInterviews.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / completedInterviews.length 
      : 0;

    // Generate growth data from history
    const growthData = completedInterviews.map(i => ({
      date: new Date(i.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: i.overall_score || 0
    })).slice(-7); // Last 7 interviews

    // If no data, show a "Today" placeholder with 0
    if (growthData.length === 0) {
      growthData.push({ 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        score: 0 
      });
    }

    return {
      data: {
        overall_score: overallScore,
        total_interviews: totalInterviews,
        streak: 1,
        readiness_status: totalInterviews > 3 ? "Ready" : totalInterviews > 0 ? "Needs Practice" : "Not Ready",
        growth_data: growthData,
        weak_areas: [
          { area: "System Design", count: Math.max(0, 3 - totalInterviews) },
          { area: "Confidence", count: Math.max(0, 1 - Math.floor(totalInterviews/2)) }
        ],
        skill_breakdown: [
          { subject: 'HR', A: Math.min(100, 60 + (totalInterviews * 5)), fullMark: 100 },
          { subject: 'Technical', A: Math.min(100, 50 + (totalInterviews * 7)), fullMark: 100 },
          { subject: 'Behavioral', A: Math.min(100, 70 + (totalInterviews * 4)), fullMark: 100 },
          { subject: 'Clarity', A: Math.min(100, 65 + (totalInterviews * 6)), fullMark: 100 },
          { subject: 'Structure', A: Math.min(100, 55 + (totalInterviews * 8)), fullMark: 100 }
        ],
        community_percentile: Math.min(99, 50 + (totalInterviews * 10)),
        goal_progress: { current: totalInterviews, target: 10, label: "Interviews this Month" }
      }
    };
  },
};

export const practiceAPI = {
  getQuestions: async (category) => {
    await delay(700);
    const questions = {
      'HR': [
        { id: "hr1", question: "Why should we hire you?", ideal_answer: "Focus on how your unique skills solve the company's specific problems. Mention past achievements that align with their goals.", key_points: ["Value proposition", "Company research", "Problem-solving"], common_mistakes: ["Being too generic", "Not mentioning company values"] },
        { id: "hr2", question: "Where do you see yourself in 5 years?", ideal_answer: "Talk about growth within the industry and the specific company. Show ambition that benefits the organization.", key_points: ["Stability", "Ambition", "Alignment"], common_mistakes: ["Saying you want to leave", "Having no clear path"] },
        { id: "hr3", question: "What are your greatest strengths?", ideal_answer: "Choose strengths relevant to the job and provide examples. Focus on both technical and soft skills.", key_points: ["Evidence-based", "Relevance", "Confidence"], common_mistakes: ["Being humble to a fault", "Listing too many unrelated skills"] },
        { id: "hr4", question: "What is your biggest weakness?", ideal_answer: "Pick a real but improvable weakness. Explain the steps you're taking to overcome it.", key_points: ["Self-awareness", "Growth mindset", "Authenticity"], common_mistakes: ["Fake weaknesses like 'I work too hard'", "Choosing a fatal flaw for the role"] },
        { id: "hr5", question: "Why do you want to work here?", ideal_answer: "Show that you've done your homework. Connect your passion with the company's mission and products.", key_points: ["Passion", "Research", "Fit"], common_mistakes: ["Focusing only on salary", "Knowing nothing about the company"] },
        { id: "hr6", question: "How do you handle pressure?", ideal_answer: "Describe a process: stay calm, prioritize tasks, and communicate clearly with stakeholders.", key_points: ["Calmness", "Prioritization", "Communication"], common_mistakes: ["Admitting you panic", "Claiming you never feel pressure"] },
        { id: "hr7", question: "Tell me about a time you showed leadership.", ideal_answer: "Leadership isn't just about titles. Describe a time you took initiative to solve a problem or guide others.", key_points: ["Initiative", "Mentorship", "Outcome"], common_mistakes: ["Taking all the credit", "Choosing a trivial example"] },
        { id: "hr8", question: "What are your salary expectations?", ideal_answer: "Provide a range based on market research. Focus on total compensation and the value you bring.", key_points: ["Market data", "Flexibility", "Value-focus"], common_mistakes: ["Giving a single low number", "Being aggressive"] },
        { id: "hr9", question: "How do you handle conflict with a coworker?", ideal_answer: "Emphasize professional communication, empathy, and finding a win-win solution for the project.", key_points: ["Empathy", "Professionalism", "Resolution"], common_mistakes: ["Avoiding conflict entirely", "Being confrontational"] },
        { id: "hr10", question: "Do you have any questions for us?", ideal_answer: "Ask about team culture, technical challenges, or the company's long-term vision.", key_points: ["Curiosity", "Engagement", "Insight"], common_mistakes: ["Saying 'No'", "Asking only about benefits"] }
      ],
      'Technical': [
        { id: "tech1", question: "What is a Closure in JavaScript?", ideal_answer: "A closure is the combination of a function bundled together with references to its surrounding state.", key_points: ["Lexical scope", "Private variables", "Memory"], common_mistakes: ["Confusing with scope", "Not knowing use cases"] },
        { id: "tech2", question: "Explain the difference between let, var, and const.", ideal_answer: "Var is function-scoped and hoisted. Let and const are block-scoped. Const cannot be reassigned.", key_points: ["Scope", "Hoisting", "Immutability"], common_mistakes: ["Thinking const objects are immutable", "Not knowing TDZ"] },
        { id: "tech3", question: "How does the Virtual DOM work in React?", ideal_answer: "React creates a lightweight copy of the UI, compares it with the previous version (diffing), and updates only the changed parts.", key_points: ["Reconciliation", "Diffing algorithm", "Performance"], common_mistakes: ["Thinking it's faster than the real DOM in every case"] },
        { id: "tech4", question: "What is the difference between SQL and NoSQL?", ideal_answer: "SQL is relational and uses structured schemas. NoSQL is non-relational and scales horizontally better.", key_points: ["Schema", "Scaling", "ACID vs BASE"], common_mistakes: ["Saying one is always better than the other"] },
        { id: "tech5", question: "Explain Big O notation.", ideal_answer: "Big O describes the execution time or space used by an algorithm as the input size grows.", key_points: ["Complexity", "Worst-case", "Scalability"], common_mistakes: ["Confusing time and space complexity"] },
        { id: "tech6", question: "What are the principles of RESTful APIs?", ideal_answer: "Statelessness, client-server architecture, uniform interface, and cacheability.", key_points: ["HTTP Methods", "Statelessness", "Resources"], common_mistakes: ["Thinking JSON is a requirement of REST"] },
        { id: "tech7", question: "How does a load balancer work?", ideal_answer: "It distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.", key_points: ["Availability", "Algorithms", "Health checks"], common_mistakes: ["Not knowing sticky sessions"] },
        { id: "tech8", question: "What is a deadlock in multithreading?", ideal_answer: "A situation where two or more threads are blocked forever, each waiting for the other to release a resource.", key_points: ["Resources", "Blocking", "Prevention"], common_mistakes: ["Thinking it's the same as a race condition"] },
        { id: "tech9", question: "Explain sync vs async programming.", ideal_answer: "Sync waits for a task to finish before moving on. Async allows the program to continue and handles the task later.", key_points: ["Event Loop", "Promises", "Callbacks"], common_mistakes: ["Thinking async is multi-threaded in JS"] },
        { id: "tech10", question: "What is database normalization?", ideal_answer: "The process of organizing data to reduce redundancy and improve data integrity.", key_points: ["Normal forms", "Data integrity", "Redundancy"], common_mistakes: ["Over-normalizing and hurting performance"] }
      ],
      'Behavioral': [
        { id: "beh1", question: "Tell me about a time you failed.", ideal_answer: "Choose a real failure, take responsibility, and emphasize what you learned and how you've improved since.", key_points: ["Ownership", "Learning mindset", "Resilience"], common_mistakes: ["Blaming others", "Using a fake failure"] },
        { id: "beh2", question: "Describe a difficult decision you had to make.", ideal_answer: "Explain the situation, the options you considered, the data you used, and the eventual outcome.", key_points: ["Decision-making", "Analysis", "Accountability"], common_mistakes: ["Making it sound like an easy choice"] },
        { id: "beh3", question: "Tell me about a conflict within a team.", ideal_answer: "Focus on the professional resolution and the positive outcome for the project, not the personal drama.", key_points: ["Collaboration", "Conflict resolution", "Outcome"], common_mistakes: ["Focusing too much on the person you disliked"] },
        { id: "beh4", question: "How do you handle a tight deadline?", ideal_answer: "Discuss prioritization, clear communication, and setting realistic expectations with stakeholders.", key_points: ["Time management", "Communication", "Efficiency"], common_mistakes: ["Saying you just work longer hours"] },
        { id: "beh5", question: "Tell me about a time you had to deal with a difficult client.", ideal_answer: "Emphasize active listening, patience, and finding a solution that satisfied their needs while maintaining boundaries.", key_points: ["Patience", "Listening", "Client success"], common_mistakes: ["Complaining about the client"] },
        { id: "beh6", question: "Describe a situation where you adapted to change.", ideal_answer: "Show your flexibility and how you helped the team transition smoothly to a new process or tool.", key_points: ["Flexibility", "Positive attitude", "Adaptability"], common_mistakes: ["Admitting you resisted the change"] },
        { id: "beh7", question: "Tell me about a time you went above and beyond.", ideal_answer: "Discuss a project where you took extra initiative to ensure exceptional quality or help a teammate.", key_points: ["Initiative", "Quality", "Support"], common_mistakes: ["Choosing a task that was just part of your job"] },
        { id: "beh8", question: "How do you handle excessive workload?", ideal_answer: "Talk about delegating, reprioritizing with your manager, and managing your energy.", key_points: ["Prioritization", "Delegation", "Transparency"], common_mistakes: ["Saying you just do it all alone"] },
        { id: "beh9", question: "Tell me about learning something new quickly.", ideal_answer: "Explain your learning process: identifying resources, hands-on practice, and asking for help when needed.", key_points: ["Learning speed", "Resources", "Application"], common_mistakes: ["Making it sound like you didn't have to work for it"] },
        { id: "beh10", question: "Describe a time you disagreed with your manager.", ideal_answer: "Show that you voiced your opinion professionally, provided evidence, and eventually supported the final decision.", key_points: ["Professionalism", "Evidence", "Team player"], common_mistakes: ["Saying you never disagree", "Being disrespectful"] }
      ]
    };
    return { data: questions[category] || questions['HR'] };
  },
};

export const adminAPI = {
  getDashboard: async () => {
    await delay(1000);
    return {
      data: {
        total_users: 1240,
        ready_for_interview: 312,
        needs_practice: 928,
        active_this_week: 450,
        average_score: 7.1,
        top_performers: [
          { id: "u1", name: "Alice Johnson", average_score: 9.4 },
          { id: "u2", name: "Bob Smith", average_score: 9.2 }
        ],
        weak_candidates: [
          { id: "u3", name: "Charlie Davis", average_score: 4.5 }
        ]
      }
    };
  },
  getUsers: async () => {
    await delay(1000);
    return { data: [
      { id: "u1", name: "Alice Johnson", email: "alice@example.com", total_interviews: 12, average_score: 9.4, streak: 15, readiness_status: "Ready" },
      { id: "u2", name: "Bob Smith", email: "bob@example.com", total_interviews: 8, average_score: 9.2, streak: 4, readiness_status: "Ready" },
      { id: "u3", name: "Charlie Davis", email: "charlie@example.com", total_interviews: 3, average_score: 4.5, streak: 0, readiness_status: "Needs Practice" }
    ] };
  },
  getUserDetail: async (userId) => {
    await delay(1000);
    return {
      data: {
        user: { id: userId, name: "Alice Johnson", email: "alice@example.com", total_interviews: 12, average_score: 9.4, streak: 15, readiness_status: "Ready" },
        interviews: [
          { id: "int-1", interview_type: "Technical", started_at: "2024-04-28T10:00:00Z", overall_score: 9.5 },
          { id: "int-2", interview_type: "System Design", started_at: "2024-04-25T14:00:00Z", overall_score: 9.2 }
        ],
        growth_data: [
          { date: "Apr 1", score: 7.0 },
          { date: "Apr 10", score: 8.5 },
          { date: "Apr 28", score: 9.5 }
        ],
        weak_areas: [{ area: "Concurrency", count: 1 }]
      }
    };
  },
  getInsights: async () => {
    await delay(1000);
    return {
      data: {
        common_mistakes: [
          { mistake: "Lack of STAR structure", frequency: 450 },
          { mistake: "Vague technical explanations", frequency: 320 },
          { mistake: "Poor time management", frequency: 180 }
        ],
        most_failed_questions: [
          { question: "Explain database sharding strategies.", count: 85 },
          { question: "How do you handle conflict with a manager?", count: 64 }
        ],
        confidence_distribution: { high: 45, medium: 40, low: 15 },
        total_interviews: 3500
      }
    };
  },
};

const api = { interceptors: { request: { use: () => {} } } };
>>>>>>> 4a36452 (Build With AI 2 - fixed login, signup, env and dependencies)
export default api;