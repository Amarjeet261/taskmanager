import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Circle, Zap } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FIXED function name + logic
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No Auth Token Found");

      const { data } = await axios.get("http://localhost:4000/api/tasks/gp", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ fixed
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
          ? data.tasks
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load tasks.");

      if (err.response?.status === 401) {
        onLogout?.();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  // ✅ fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ FIXED stats logic
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" &&
          t.completed.toLowerCase() === "yes"),
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;

    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100) // ✅ fixed Math
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // ✅ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>

          <p className="text-sm mb-3">{error}</p>

          <button
            onClick={fetchTasks} // ✅ fixed name
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        {/* ✅ fixed grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks, stats }} />
          </div>
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                  }
                />

                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  }
                />

                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-500" />}
                />

                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" /> }
                />
              </div>

              <hr className="my-3 sm:py-4 border-purple-100"/>

              <div className="">
                <span className=""></span>
                <span className=""></span>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
