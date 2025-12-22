import './App.css'
import { Routes, Route,} from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage.jsx';
import AboutPage from './Pages/AboutPage/AboutPage.jsx';
import AdminPage from './Pages/AdminPage/AdminPage.jsx';
import LoginPage from './Pages/LoginPage/LoginPage.jsx';



function App() {

  return (
    <>
       {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        
      </Routes>
    </>
  )
}

export default App
