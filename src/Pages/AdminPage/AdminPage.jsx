import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {FiHome,FiUsers,FiChevronDown,FiFolder,FiCalendar,FiBookOpen,FiX,FiSettings,FiLogOut,FiMenu,} from "react-icons/fi";

function AdminPage() {

  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-white/30 text-white font-semibold" : "hover:bg-white/20"}`;

  return (
    <>
      {/* Mobile Menu Icon */}
      <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gradient-to-r from-[#A953BA] to-[#F68961] bg-opacity-100 backdrop-blur-md text-white rounded-full shadow-lg hover:from-[#F68961] hover:to-[#A953BA] transition-all"><FiMenu size={24} /></button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 start-0 z-50 w-64 transition-transform duration-300 ${ open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 bg-gradient-to-r from-[#A953BA] to-[#F68961] bg-opacity-30 backdrop-blur-xl border-r border-white/20 shadow-2xl`}>
        <div className="flex flex-col h-full text-white">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-white/20">
            <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
            <button className="lg:hidden p-1 rounded-full hover:bg-white/20" onClick={() => setOpen(false)}> <FiX size={20} /> </button>
          </header>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1 text-[15px] font-medium">
              <li>
                <NavLink to="/admin/dashboard" className={linkClass}><FiHome /> Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className={linkClass}><FiUsers /> Users <FiChevronDown className="ms-auto" /></NavLink>
              </li>
              <li>
                <NavLink to="/admin/projects" className={linkClass}> <FiFolder /> Projects <FiChevronDown className="ms-auto" /></NavLink>
              </li>
              <li>
                <NavLink to="/admin/calendar" className={linkClass}><FiCalendar /> Calendar </NavLink>
              </li>
              <li>
                <NavLink to="/admin/documentation" className={linkClass}><FiBookOpen /> Documentation</NavLink>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <footer className="p-4 border-t border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://images.unsplash.com/photo-1734122415415-88cb1d7d5dc0" className="w-8 h-8 rounded-full border border-white/30" alt="avatar"/> <span className="font-medium">Mia Hudson</span>
            </div>

            <div className="space-y-1 text-sm">
              <NavLink to="/admin/settings" className={linkClass}> <FiSettings /> Settings</NavLink>
              <NavLink to="/admin/logout" className={linkClass}> <FiLogOut /> Sign out</NavLink>
            </div>
          </footer>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)}/>
      )}

      {/* Main Content */}
      <div>
        <div className="lg:ml-64 p-8">
          <Routes>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/users" element={<h1>Users</h1>} />
            <Route path="/projects" element={<h1>Projects</h1>} />
            <Route path="/calendar" element={<h1>Calendar</h1>} />
            <Route path="/documentation" element={<h1>Documentation</h1>} />
            <Route path="/settings" element={<h1>Settings</h1>} />
            <Route path="/logout" element={<h1>Logout</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
