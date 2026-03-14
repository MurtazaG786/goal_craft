import axios from "axios"

const API=axios.create(
    {
        baseURL: "http://localhost:8000",
    }
)
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
  API.get(`/goal/milestones/${goalId}`)

export const getTodayTasks = () =>
  API.get("/goal/tasks/today")

export const getTasksForMilestone = (milestoneId: number) => {
  return API.get(`/goal/milestone/${milestoneId}/tasks`)
}