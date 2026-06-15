import { createBrowserRouter } from "react-router-dom";
import { AdminLogin } from "./components/AdminLogin";
import { ForgotPassword } from "./components/ForgotPassword";
import { AdminDashboard } from "./components/AdminDashboard";
import { Profile } from "./components/Profile";
import { TravelerVerification } from "./components/TravelerVerification";
import { VerificationLogs } from "./components/VerificationLogs";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLogin,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/profile",
    Component: Profile,
  },
  {
    path: "/admin/verification",
    Component: TravelerVerification,
  },
  {
    path: "/admin/logs",
    Component: VerificationLogs,
  },
  // Catch-all for 404
  {
    path: "*",
    Component: NotFound,
  },
]);
