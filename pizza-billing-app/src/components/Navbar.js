import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Function to determine if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#6f4f1f] shadow-lg p-4">
      <div className="flex justify-between items-center">
        {/* Logo with proper styling */}
        <div className="flex items-center space-x-4">
          <img 
            src="/images/logo.png" 
            alt="Pizza Shop Logo" 
            className="w-12 h-12 object-contain rounded-full"
          />
          <Link to="/" className={`font-bold text-xl transition duration-300 ${
            isActive('/') ? 'text-[#d4a373]' : 'text-white hover:text-[#d4a373]'
          }`}>
            Pizza Billing App
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link 
            to="/items" 
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              isActive('/items') ? 'bg-[#8b5d33] text-[#d4a373]' : 'text-white hover:bg-[#8b5d33]'
            }`}
          >
            Items
          </Link>
          <Link 
            to="/invoices" 
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              isActive('/invoices') ? 'bg-[#8b5d33] text-[#d4a373]' : 'text-white hover:bg-[#8b5d33]'
            }`}
          >
            Invoices
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
