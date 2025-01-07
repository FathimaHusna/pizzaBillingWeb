import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { createInvoice, getInvoices } from "../../services/Api";


const CreateInvoicePage = () => {

  const [invoiceData, setInvoiceData] = useState({
    customer_name: "",
    date: new Date().toISOString().slice(0, 10),
    items: [{ id: Date.now(), name: "", quantity: 1, price: 0 }],
  });

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getInvoices(); // Replace this API call with the actual one
        if (Array.isArray(response)) {
          setCustomers(response);
        } else {
          throw new Error("Invalid customer data received.");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerSelect = (customer) => {
    setInvoiceData({ ...invoiceData, customer_name: customer });
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { id: Date.now(), name: "", quantity: 1, price: 0 },
      ],
    });
  };

  const handleRemoveItem = (id) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((item) => item.id !== id),
    });
  };

  const navigate = useNavigate();
  const handleViewInvoice = () => {
    const totalAmount = parseFloat(calculateTotal().toFixed(2));
    const taxAmount = parseFloat((totalAmount * 0.1).toFixed(2)); // Example tax rate: 10%
    const netAmount = parseFloat((totalAmount + taxAmount).toFixed(2));

    const fullInvoiceData = {
        ...invoiceData,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        net_amount: netAmount,
    };
    

    // Navigate to PrintInvoice page and pass data
    navigate("/print-invoice", { state: { invoice: fullInvoiceData } });
};
  const calculateTax = (totalAmount, taxRate = 0.1) => totalAmount * taxRate;

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSaveInvoice = async () => {
    const { customer_name, date, items } = invoiceData;

    if (!customer_name || !date || !items || items.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    const totalAmount = parseFloat(calculateTotal().toFixed(2));
    const taxAmount = parseFloat(calculateTax(totalAmount).toFixed(2));
    const netAmount = parseFloat((totalAmount + taxAmount).toFixed(2));

    let isoDate;
    try {
      isoDate = new Date(date).toISOString();
    } catch (err) {
      alert("Invalid date format.");
      return;
    }

    const payload = {
      customer_name,
      date: isoDate,
      total_amount: totalAmount,
      tax_amount: taxAmount,
      net_amount: netAmount,
      items: items.map((item) => ({
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        amount: item.quantity * item.price,
        ...(item.id && { item_id: item.id }),
      })),
    };

    try {
      console.log("Sending payload:", payload);
      const response = await createInvoice(payload);
      alert(response.message || "Invoice saved successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error);
      const errorMessage = error.response?.data?.error || "Failed to save invoice.";
      alert(errorMessage);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current !== event.target
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-[#6f4f1f] mb-6">Create Invoice</h1>

      <div className="relative mb-4 flex items-center border rounded-md px-3 py-2" ref={dropdownRef}>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search Customer"
          className="w-full outline-none"
          autoComplete="off"
        />
        <FiSearch
          className="text-gray-500 cursor-pointer ml-2"
          onClick={() => searchInputRef.current.focus()}
          size={20}
        />
        {showDropdown && searchTerm && (
          <ul className="absolute top-full left-0 w-full border rounded-md mt-1 bg-white z-10 max-h-40 overflow-auto shadow-md">
            {customers
              .filter((customer) =>
                customer.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((customer, index) => (
                <li
                  key={index}
                  onClick={() => handleCustomerSelect(customer)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {customer}
                </li>
              ))}
            {!customers.some((customer) =>
              customer.toLowerCase().includes(searchTerm.toLowerCase())
            ) && <li className="px-3 py-2 text-gray-500">No customers found</li>}
          </ul>
        )}
      </div>

      <p className="text-lg mb-4">
        Customer Name: <span className="font-semibold">{invoiceData.customer_name || "N/A"}</span>
      </p>

      <div className="p-6 border border-gray-300 rounded-lg bg-white">
        <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-[#6f4f1f] text-white">
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
  <input
    type="number"
    value={item.quantity}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        handleChange(index, "quantity", value);
      }
    }}
    min="0"
    className="border px-2 py-1"
  />
</td>
<td className="px-4 py-2">
  <input
    type="number"
    value={item.price}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        handleChange(index, "price", value);
      }
    }}
    min="0"
    className="border px-2 py-1"
  />
</td>

                <td className="px-4 py-2">Rs. {(item.quantity * item.price).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleAddItem}
          className="mt-4 bg-[#6f4f1f] text-white py-2 px-4 rounded hover:bg-[#5a3e1a]"
        >
          Add Item
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSaveInvoice}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Save Invoice
        </button>
        <button 
                onClick={handleViewInvoice}
                className="bg-black text-white py-2 px-4 rounded"
            >
                View Invoice
            </button>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
