import axios from "axios"

const runtimeApiUrl = window.__CONFIG__?.API_URL;
export const API_BASE_URL = runtimeApiUrl || import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:logout"));
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface CreateGoalRequest {
  goal: string;
  description: string
  deadline: string;
  difficulty: "easy" | "medium" | "hard"
}

export const createGoal = async (data: CreateGoalRequest) => {
  const response = await API.post("/goal/create", data);
  return response.data;
};

export const getGoals = () => API.get("/goal/goals")

export const getMilestones = (goalId:number) =>
  API.get(`/goal/${goalId}/milestones`)

export const getTodayTasks = () =>
  API.get("/goal/daily")

export const getTasksForMilestone = (milestoneId: number) => {
  return API.get(`/goal/milestone/${milestoneId}/tasks`)
}

export const getSideQuests = () => API.get("/goal/side_quests")

export const completeSideQuest = (xp: number) =>
  API.post("/goal/side_quests/complete", { xp })

export default API;