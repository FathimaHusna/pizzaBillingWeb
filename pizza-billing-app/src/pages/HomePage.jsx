// pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f8f1e1] text-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-5xl font-extrabold text-[#6f4f1f] mb-6">
          Welcome to Pizza Billing App 🍕
        </h1>
        <p className="text-lg max-w-xl mb-8">
          Manage your pizza shop effortlessly with our modern billing system. Track orders, manage items, and generate invoices seamlessly.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/items" 
            className="bg-[#8b5d33] text-white px-6 py-3 rounded-lg hover:bg-[#6f4f1f] transition duration-300"
          >
            Manage Items
          </Link>
          <Link 
            to="/invoices" 
            className="bg-[#6f4f1f] text-white px-6 py-3 rounded-lg hover:bg-[#8b5d33] transition duration-300"
          >
            View Invoices
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#6f4f1f] mb-8">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3">🍕 Item Management</h3>
            <p>Easily add, update, and delete pizza items with prices and descriptions.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3">📦 Invoice Generation</h3>
            <p>Generate detailed invoices with item breakdown, taxes, and total amounts.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-3">📊 Sales Tracking</h3>
            <p>Keep track of your daily sales and monitor revenue with ease.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center py-6 bg-[#6f4f1f] text-white">
        <p>&copy; {new Date().getFullYear()} Pizza Billing App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
