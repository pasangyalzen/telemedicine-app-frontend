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
import UserManagement from "../pages/Admin/components/UserManagement";
import DoctorManagement from "../pages/Admin/components/DoctorManagement";
import PatientManagement from "../pages/Admin/components/PatientManagement";
import PharmacistManagement from "../pages/Admin/components/PharmacistManagement";
import AppointmentManagement from "../pages/Admin/components/AppointmentManagement";
import PaymentsManagement from "../pages/Admin/components/PaymentsManagement";
import ReportsManagement from "../pages/Admin/components/ReportsManagement";
import SecuritySettings from "../pages/Admin/components/SecuritySettings";
import NotificationsSettings from "../pages/Admin/components/NotificationsSettings";
import SettingsPage from "../pages/Admin/components/SettingsPage";
import PatientDashboard from "../pages/Patient/PatientDashboard";
import LobbyScreen from "../screens/Lobby";
import { SocketProvider } from "../context/SocketProvider";
import RoomPage from "../screens/Room";
import PatientBookAppointmentPage from "../pages/Patient/PatientBookAppointmentPage";
import PharmacistDashboard from "../pages/Pharmacist/PharmacistDashboard";
import VerifyPayment from "../pages/Patient/components/VerifyPayment";
export default function AppRoutes() {
  return (
    <BrowserRouter>
    <SocketProvider>
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.PATIENTVIDEOCALLDASHBOARD} element={<PatientVideoCallDashboard />} />
        <Route path={PATHS.PATIENTDASHBOARD} element={<PatientDashboard/>}/>
        <Route path={PATHS.PHARMACISTDASHBOARD} element={<PharmacistDashboard />} />
        <Route path="/book-appointment" element={<PatientBookAppointmentPage />} />
        <Route path={PATHS.DOCTORWAITINGROOMDASHBOARD} element={<DoctorWaitingRoomDashboard />} />
        <Route path={PATHS.LOBBY} element = {<LobbyScreen/>}/>
        <Route path={PATHS.ROOM} element={<RoomPage />} />
        <Route path={PATHS.VERIFYPAYMENT} element={<VerifyPayment />} />
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
      </SocketProvider>
    </BrowserRouter>
  );
}