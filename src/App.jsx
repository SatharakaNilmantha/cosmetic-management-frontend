import './App.css'
import { Routes, Route,} from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage';
import AboutPage from './Pages/AboutPage/AboutPage';
import AdminPage from './Pages/AdminPage/AdminPage';



function App() {

  return (
    <>
       {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </>
  )
}

export default App
