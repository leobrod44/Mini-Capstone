import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PropertyForm from "./pages/PropertyForm";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
       <ToastContainer pauseOnHover={false} autoClose={1000} />
    <Routes>
    <Route path="/" element={<LandingPage />} />

    <Route path="/user-profile" element={<UserProfile/>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/add-property" element={<PropertyForm />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
