import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage.jsx';
import AboutPage from './Pages/AboutPage/AboutPage.jsx';
import AdminPage from './Pages/AdminPage/AdminPage.jsx';
import LoginPage from './Pages/LoginPage/LoginPage';
import SignUpPage from './Pages/SignUpPage/SignUpPage';

import PopupMessage from './Components/PopupMessageComponent/PopupMessage.jsx';

function App() {
  return (
    <BrowserRouter>
      <PopupMessage/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
