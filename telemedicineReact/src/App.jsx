import './App.css'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from "react-hot-toast";
import toastOptions from './utils/toastOptions';
import PaginationComponent from './pages/Admin/components/PaginationComponent';


function App() {
  return (
    <>
      <AppRoutes />
      <Toaster {...toastOptions} />
    </>
  )
}

export default App
