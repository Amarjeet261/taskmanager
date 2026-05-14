import { Route, Routes, useNavigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./features/dashboard/components/Dashboard";
import TasksPage from "./features/tasks/components/TasksPage";
import TeamPage from "./features/team/components/TeamPage";
import CalendarPage from "./features/calendar/components/CalendarPage";
import SettingsPage from "./features/settings/components/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

export default function App() {
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  const handleAuthSubmit = (data) => {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name || "New User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=7B2FF7&color=fff`,
      role: 'Member',
    };

    login(user);
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
