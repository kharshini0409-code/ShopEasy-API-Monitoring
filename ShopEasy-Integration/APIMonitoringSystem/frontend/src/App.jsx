
import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import APIManagement from "./pages/APIManagement";
import Monitoring from "./pages/Monitoring";
import Security from "./pages/Security";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">

        <Sidebar />

        <main className="main-content">

          <header className="dashboard-header">
            <div className="user-profile">
              <span>Admin</span>

              <div className="user-avatar">
                A
              </div>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/apis"
              element={<APIManagement />}
            />

            <Route
              path="/monitoring"
              element={<Monitoring />}
            />

            <Route
              path="/security"
              element={<Security />}
            />
            <Route path="/settings" element={<Settings />} />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
