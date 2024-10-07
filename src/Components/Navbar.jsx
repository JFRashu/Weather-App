import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-white/30 backdrop-blur-[5%] fixed top-0 w-full z-50 shadow-sm ">
      <div className="navbar-start mr-50">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white/70 backdrop-blur-md rounded-box z-[20] mt-3 w-52 p-2 shadow"
          >
            <li><Link to="/" className="hover:bg-white/50 rounded-lg">Home</Link></li>
            <li><Link to="/forecast" className="hover:bg-white/50 rounded-lg">Forecast</Link></li>
            <li><Link to="/airquality" className="hover:bg-white/50 rounded-lg">Air Quality</Link></li>
            <li><Link to="/citycomparison" className="hover:bg-white/50 rounded-lg">Compare My City Weather</Link></li>
            <li><Link to="/help" className="hover:bg-white/50 rounded-lg">Help</Link></li>
            <li><Link to="/about" className="hover:bg-white/50 rounded-lg">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        {/* <img src="/public/weather_icon_2.png" alt="Weather Icon" className="h-12 w-12 " /> */}
        <a className="btn btn-ghost text-xl font-semibold">Weather App</a>
      </div>

     
    </div>
  );
};

export default Navbar;