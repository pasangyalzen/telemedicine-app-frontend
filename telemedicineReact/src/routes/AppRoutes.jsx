import { BrowserRouter, Route,Routes } from "react-router-dom"
import { PATHS } from "../constants/path"
import Home from "../pages/Home"
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import PatientVideoCallDashboard from "../pages/Patient/PatientVideoCallDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import DoctorWaitingRoomDashboard from "../pages/Doctor/DoctorWaitingRoomDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={PATHS.HOME} element= {<Home />}/>
                <Route path={PATHS.LOGIN} element= {<LoginPage />} />
                <Route path={PATHS.REGISTER} element = {<RegisterPage />} />
                <Route path={PATHS.PATIENTVIDEOCALLDASHBOARD} element = {<PatientVideoCallDashboard/>} />
                <Route path={PATHS.DOCTORWAITINGROOMDASHBOARD} element ={<DoctorWaitingRoomDashboard/>}/>
                <Route path={PATHS.ADMINDASHBOARD} element ={<AdminDashboard/>}/>
                <Route path="*" element={<NotFoundPage />} /> {/* 404 Page */}

            </Routes>
        </BrowserRouter>
    )
}