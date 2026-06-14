
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import LeaveManagement from "./pages/LeaveManagement";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-management"
          element={
            <ProtectedRoute>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

