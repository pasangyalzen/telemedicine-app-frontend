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
// import Users from "../pages/Admin/Users";
// import Doctors from "../pages/Admin/Doctors";
// import Patients from "../pages/Admin/Patients";
// import Pharmacists from "../pages/Admin/Pharmacists";
// import Appointments from "../pages/Admin/Appointments";
// import Payments from "../pages/Admin/Payments";
// import Reports from "../pages/Admin/Reports";
// import Security from "../pages/Admin/Security";
// import Notifications from "../pages/Admin/Notifications";
// import Settings from "../pages/Admin/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.PATIENTVIDEOCALLDASHBOARD} element={<PatientVideoCallDashboard />} />
        <Route path={PATHS.DOCTORWAITINGROOMDASHBOARD} element={<DoctorWaitingRoomDashboard />} />
        <Route path={PATHS.ADMINDASHBOARD} element={<AdminDashboard />}/>
        
        {/* Admin Dashboard with Nested Routes */}
        {/*<Route path={PATHS.ADMINDASHBOARD} element={<AdminDashboard />}>
          <Route index element={<Users />} /> 
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="pharmacists" element={<Pharmacists />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>*/}

        <Route path="*" element={<NotFoundPage />} /> {/* 404 Page */}
      </Routes>
    </BrowserRouter>
  );
}