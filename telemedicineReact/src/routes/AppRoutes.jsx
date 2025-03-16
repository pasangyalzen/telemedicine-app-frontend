import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATHS } from "../constants/path";
import Home from "../pages/Home";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import PatientVideoCallDashboard from "../pages/Patient/PatientVideoCallDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import DoctorWaitingRoomDashboard from "../pages/Doctor/DoctorWaitingRoomDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";

// Import Admin Pages
import UserManagement from "../components/UserManagement";
import DoctorManagement from "../components/DoctorManagement";
import PatientManagement from "../components/PatientManagement";
import PharmacistManagement from "../components/PharmacistManagement";
import AppointmentManagement from "../components/AppointmentManagement";
import PaymentsManagement from "../components/PaymentsManagement";
import ReportsManagement from "../components/ReportsManagement";
import SecuritySettings from "../components/SecuritySettings";
import NotificationsSettings from "../components/NotificationsSettings";
import SettingsPage from "../components/SettingsPage";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.PATIENTVIDEOCALLDASHBOARD} element={<PatientVideoCallDashboard />} />
        <Route path={PATHS.DOCTORWAITINGROOMDASHBOARD} element={<DoctorWaitingRoomDashboard />} />

        {/* Admin Dashboard with Nested Routes */}
        <Route path={PATHS.ADMINDASHBOARD} element={<AdminDashboard />}>
          {/* Nested Routes for Admin Dashboard */}
          <Route index element={<UserManagement />} /> {/* Default route when /admin/dashboard is accessed */}
          <Route path="users" element={<UserManagement />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="pharmacists" element={<PharmacistManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} /> {/* 404 Page */}
      </Routes>
    </BrowserRouter>
  );
}