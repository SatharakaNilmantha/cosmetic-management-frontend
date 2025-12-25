import './App.css'
import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage.jsx';
import AboutPage from './Pages/AboutPage/AboutPage.jsx';
import AdminPage from './Pages/AdminPage/AdminPage.jsx';
import LoginPage from './Pages/LoginPage/LoginPage'; // Add this import
import SignUpPage from './Pages/SignUpPage/SignUpPage'; // Add this import

function App() {
  return (
    <>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add this */}
        <Route path="/signup" element={<SignUpPage />} /> {/* Add this */}
      </Routes>
    </>
  )
}

export default App