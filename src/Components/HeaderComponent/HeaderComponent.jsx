import { useState } from 'react';
import { NavLink ,Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import logo1 from '../../Images/logo/logoRemovebg1.png';
import './HeaderComponent.css';

function HeaderComponent() {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="text-center font-medium  h-90 bg-red-300 flex items-center justify-center shadow-md">
        <p className='text-white'>
          Exclusive Price Drop! Hurry, <span className="underline underline-offset-2 text-white">Offer Ends Soon!</span>
        </p>
      </div>

      {/* Navigation Bar */}
      <nav className="glass-nav fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between px-6 py-4 w-[90%] max-w-[1500px] z-50 backdrop-blur-md bg-white/30 border border-white/30 rounded-[50px]  shadow-lg transition-all">

        {/* Logo */}
        <a href="/"> 
          <img className='h-12' src={logo1} alt="Logo" /> 
        </a>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'activeLink font-semibold' : ''}`}>Home</NavLink>
          <NavLink to="/About" className={({ isActive }) => `nav-link ${isActive ? 'activeLink font-semibold' : ''}`}>About</NavLink>
          <NavLink to="/Products" className={({ isActive }) => `nav-link ${isActive ? 'activeLink font-semibold' : ''}`}>Products</NavLink>
          <NavLink to="/Contact" className={({ isActive }) => `nav-link ${isActive ? 'activeLink font-semibold' : ''}`}>Contact</NavLink>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full shadow border border-purple-300 w-50 transition focus-within:border-purple-400 focus-within:ring-purple-200">
            <input type="text" placeholder="Search products" className="w-56 bg-transparent outline-none text-sm placeholder-gray-500" />
            <IoSearch className="text-gray-500 text-base" />
          </div>



          {/* Shopping Cart */}
          <div className="relative cursor-pointer">
            <FiShoppingCart className="text-2xl text-gray-500" />
            <span className="absolute -top-2 -right-3 text-xs text-white w-[18px] h-[18px] rounded-full flex items-center justify-center bg-[linear-gradient(to_right,#FF0000DD,#FF0000A1)]">3</span>
          </div>

          {/* Login Button */}
          <Link to="/login" className="inline-block cursor-pointer shadow px-6 py-2 bg-[linear-gradient(to_right,#A953BACF,#F68961BE)] hover:bg-[linear-gradient(to_right,#F689619E,#A953BAAF)] transition text-white rounded-full text-sm"> Login </Link>
       
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden text-gray-700 text-2xl"> {open ? <HiOutlineX /> : <HiOutlineMenu />}  </button>

        {/* Mobile Menu */}
        <div className={` glass-nav1 sm:hidden absolute top-[70px] left-0 w-full bg-white shadow-md flex-col items-start gap-2 px-5 text-sm overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 py-4 flex' : 'max-h-0 py-0 hidden'}`}>
         
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active font-semibold' : ''}`} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/About" className={({ isActive }) => `nav-link ${isActive ? 'active font-semibold' : ''}`} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/Products" className={({ isActive }) => `nav-link ${isActive ? 'active font-semibold' : ''}`} onClick={() => setOpen(false)}>Products</NavLink>
          <NavLink to="/Contact" className={({ isActive }) => `nav-link ${isActive ? 'active font-semibold' : ''}`} onClick={() => setOpen(false)}>Contact</NavLink>

          <Link to="/login" className="inline-block cursor-pointer shadow px-6 py-2 bg-[linear-gradient(to_right,#A953BACF,#F68961BE)] hover:bg-[linear-gradient(to_right,#F689619E,#A953BAAF)]transition text-white rounded-full text-sm">  Login </Link>  
        </div>
      </nav>
    </>
  )
}

export default HeaderComponent;
