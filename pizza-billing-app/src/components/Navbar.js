import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
          <Link to="/" className="text-white font-bold text-xl hover:text-[#d4a373] transition duration-300">
            Pizza Billing App
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link 
            to="/items" 
            className="text-white hover:bg-[#8b5d33] px-4 py-2 rounded-lg transition duration-300"
          >
            Items
          </Link>
          <Link 
            to="/invoices" 
            className="text-white hover:bg-[#8b5d33] px-4 py-2 rounded-lg transition duration-300"
          >
            Invoices
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
