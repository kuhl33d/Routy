import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import DriverDashboard from "@/pages/DriverDashboard";
import LoginPage from "@/pages/Login";
import SignUpPage from "@/pages/Signup";
import AdminDashboard from "@/pages/Admin";
import Home2 from "@/pages/Home2";
import Parent from "@/pages/parent/Parent";
import Tracking from "@/pages/parent/Tracking";
import School from "@/pages/School/School";
import DriverView from "@/pages/Views/DriverView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home2 />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/home2" element={<Home />} />
      <Route path="/parent" element={<Parent />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/school" element={<School />} />
      {/* Testing Only */}
      <Route path="/DriverView" element={<DriverView />} />
    </Routes>
  );
}
