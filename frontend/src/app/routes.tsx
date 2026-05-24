import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateGoal } from "./pages/CreateGoal";
import { Calendar } from "./pages/Calendar";
import { MilestoneJourney } from "./pages/MilestoneJourney";
import { SideQuests } from "./pages/SideQuests";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <Layout />;
}

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  {
    path: "/",
    Component: ProtectedRoute,
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