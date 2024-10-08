import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/Footer';

const Layout = () => {
  return (
   <>
         {/* Navbar (self-closing tag) */}
         <Navbar />
      {/* Outlet (self-closing tag) */}
      <Outlet/>
      {/* Footer (self-closing tag) */}
      <Footer />
   </>

 
  );
};

export default Layout;
