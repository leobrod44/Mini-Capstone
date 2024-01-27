import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<LandingPage />} />

    <Route path="/user-profile" element={<UserProfile/>} />
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
