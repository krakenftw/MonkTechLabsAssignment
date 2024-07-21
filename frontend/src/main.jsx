import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/user";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import Navbar from "./components/navbar.jsx";
import RegisterPage from "./pages/Register.jsx";
import AvailibiltyPage from "./pages/EmpAvailibilty.jsx";
import AdminAvailibiltyPage from "./pages/Admin.jsx";
import AdminShifts from "./pages/AdminShifts.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import EmployeeShifts from "./pages/EmployeeShift.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/employee/availibilty", element: <AvailibiltyPage /> },
  { path: "/employee/shifts", element: <EmployeeShifts /> },

  { path: "/admin/availibilty", element: <AdminAvailibiltyPage /> },
  { path: "/admin/shifts", element: <AdminShifts /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}>
        <Navbar />
      </RouterProvider>
    </UserProvider>
    <Toaster />
  </React.StrictMode>,
);
