import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-24 text-sm">
        {/* About Section */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Dealzaro Logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            Dealzaro is a brand in the fashion and apparel industry. It has been the go-to choice
            for trendsetters since its inception, when visionary designers began curating
            collections to redefine online shopping. From everyday essentials to runway-inspired
            looks, Dealzaro transforms a simple scroll into a bold style statement.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="tel:+919876543210">+91-9876543210</a></li>
            <li><a href="mailto:contact@dealzaro.com">contact@dealzaro.com</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © {new Date().getFullYear()} Dealzaro. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
