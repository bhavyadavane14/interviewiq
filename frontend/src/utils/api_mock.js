// MOCKED API IMPLEMENTATION FOR LOCAL TESTING
// Use this only when the backend is not available

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

let currentAnswersCount = 0;

export const authAPI = {
  signup: async (data) => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem("mock_users_list") || "[]");
    if (!users.find(u => u.email === data.email)) {
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
    if (!exists) throw { response: { data: { detail: "Account not found. Please create an account first." } } };
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
      questions: [{ id: "q1", question: `Welcome! Let's start the ${data.interview_type} interview with a focus on ${data.focus_area || 'General skills'}.`, difficulty: "medium", number: 1 }],
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
    const isComplete = currentAnswersCount >= 10;
    const nextQuestion = isComplete ? null : { id: `q${currentAnswersCount + 1}`, question: "Next question...", difficulty: "medium" };
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    const interview = history.find(i => i.id === data.interview_id);
    if (interview) {
      interview.answers.push({ question_id: data.question_id, answer_text: data.answer_text });
      if (nextQuestion) interview.questions.push(nextQuestion);
      localStorage.setItem("mock_interview_history", JSON.stringify(history));
    }
    return { data: { success: true, is_complete: isComplete, next_question: nextQuestion, evaluation: { score: 8, feedback: "Good answer." } } };
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
    return { data: { id: interviewId, overall_score: 8.4, readiness_flag: "Ready" } };
  },
  getHistory: async () => {
    await delay(800);
    return { data: JSON.parse(localStorage.getItem("mock_interview_history") || "[]") };
  },
};

export const analyticsAPI = {
  getDashboard: async () => {
    await delay(1000);
    const history = JSON.parse(localStorage.getItem("mock_interview_history") || "[]");
    const completed = history.filter(i => i.status === 'completed');
    const score = completed.length > 0 ? completed.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / completed.length : 0;
    return {
      data: {
        overall_score: score,
        total_interviews: history.length,
        streak: 1,
        readiness_status: "Ready",
        growth_data: [],
        weak_areas: [],
        skill_breakdown: [],
        community_percentile: 85,
        goal_progress: { current: history.length, target: 10, label: "Interviews" }
      }
    };
  }
};
