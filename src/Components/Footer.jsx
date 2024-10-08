import React from 'react';
import {
  FaInstagram,
  FaLinkedin,
  FaFacebookSquare,
  FaTwitter,
  FaGithubSquare,
  FaCode,
  FaHeart
} from "react-icons/fa";
import './footer_design.css';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-black text-cyan-50 p-10">
      {/* Navigation Links
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover transition-colors duration-200 hover:text-cyan-400">
          About us
        </a>
        <a className="link link-hover transition-colors duration-200 hover:text-cyan-400">
          Contact
        </a>
        <a className="link link-hover transition-colors duration-200 hover:text-cyan-400">
          Jobs
        </a>
        <a className="link link-hover transition-colors duration-200 hover:text-cyan-400">
          Press kit
        </a>
      </nav> */}
      
      {/* Social Media Icons with Animations */}
      <nav className="grid grid-flow-col gap-4">
        <a className="social-icon-instagram">
          <FaInstagram className="text-2xl" />
        </a>
        <a className="social-icon-github">
          <FaGithubSquare className="text-2xl" />
        </a>
        <a className="social-icon-linkedin">
          <FaLinkedin className="text-2xl" />
        </a>
        <a className="social-icon-facebook">
          <FaFacebookSquare className="text-2xl" />
        </a>
        <a className="social-icon-twitter">
          <FaTwitter className="text-2xl" />
        </a>
      </nav>
      
      {/* Developer and API Credits */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <FaCode className="text-cyan-400 animate-pulse" />
          <span>Developed with</span>
          <FaHeart className="text-red-500 animate-pulse" />
          <span>by</span>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-cyan-400 hover:underline"
          >
            Jannatul Farzana Rashumoni
          </a>
        </div>
        
        <div className="text-xs text-gray-400">
          APIs Used:{' '}
          <span className="text-cyan-400">OpenWeatherMap</span>
          {' & '}
          <span className="text-cyan-400">AlAdhan Prayer Times</span>
        </div>
      </div>

      {/* Copyright */}
      <aside>
        <p className="text-sm opacity-80">
          Copyright © {new Date().getFullYear()} - All rights reserved
        </p>
      </aside>
    </footer>
  );
};

export default Footer;