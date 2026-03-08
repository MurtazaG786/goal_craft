import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateGoal } from "./pages/CreateGoal";
import { Calendar } from "./pages/Calendar";
import { MilestoneJourney } from "./pages/MilestoneJourney";
import { SideQuests } from "./pages/SideQuests";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "create-goal", Component: CreateGoal },
      { path: "calendar", Component: Calendar },
      { path: "milestone-journey", Component: MilestoneJourney },
      { path: "side-quests", Component: SideQuests },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);