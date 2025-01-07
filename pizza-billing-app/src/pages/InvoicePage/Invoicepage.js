import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInvoices, deleteInvoice } from "../../services/Api"; // Adjust the path as per your project structure

const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState("asc"); // To track sorting order
    const navigate = useNavigate();

    // Fetch invoices on component mount
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getAllInvoices();
                setInvoices(data);
                setFilteredInvoices(data); // Set the initial filtered invoices
            } catch (err) {
                setError("Failed to load invoices. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = invoices.filter((invoice) =>
            invoice.customer_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredInvoices(filtered);
    };

    // Handle sorting
    const handleSort = () => {
        const sortedInvoices = [...filteredInvoices].sort((a, b) => {
            if (sortOrder === "asc") {
                return a.total_amount - b.total_amount;
            } else {
                return b.total_amount - a.total_amount;
            }
        });
        setFilteredInvoices(sortedInvoices);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
    };

    // Navigate to view invoice page
    const handleViewInvoice = (invoiceId) => {
        navigate(`/invoice/${invoiceId}`);
    };

    // Handle delete invoice
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            try {
                await deleteInvoice(id);
                setInvoices((prevInvoices) =>
                    prevInvoices.filter((invoice) => invoice.id !== id)
                );
                setFilteredInvoices((prevInvoices) =>
                    prevInvoices.filter((invoice) => invoice.id !== id)
                );
                alert("Invoice deleted successfully!");
            } catch (err) {
                console.error("Error deleting invoice:", err);
                setError("Failed to delete invoice. Please try again.");
            }
        }
    };

    // Get current invoices for pagination
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

    // Show loading state
    if (loading) {
        return <div>Loading invoices...</div>;
    }

    // Show error state
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-[#6f4f1f]">Invoice Management</h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2 rounded-md mb-4"
            />

            {/* Add Invoice Button */}
            <button
                className="bg-[#6f4f1f] text-white px-6 py-3 mb-4 rounded-lg hover:bg-[#8b5d33] transition duration-300 mx-2"
                onClick={() => navigate("/create-invoice")}
            >
                + Add New Invoice
            </button>

            {/* Sort Button */}
            <button
                className="bg-[#6f4f1f] text-white px-6 py-3 mb-4 ml-4 rounded-lg hover:bg-[#8b5d33] transition duration-300"
                onClick={handleSort}
            >
                Sort by Total Amount {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>

            {currentInvoices.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-[#6f4f1f] text-white">
                            <th className="px-4 py-2">Invoice ID</th>
                            <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Total Amount</th>
                            <th className="px-4 py-2">Tax Amount</th>
                            <th className="px-4 py-2">Net Amount</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoices.map((invoice) => (
                            <tr key={invoice.id} className="border-t hover:bg-gray-100">
                                <td className="px-4 py-2">{invoice.id}</td>
                                <td className="px-4 py-2">{invoice.customer_name}</td>
                                <td className="px-4 py-2">{new Date(invoice.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">Rs.{invoice.total_amount.toFixed(2)}</td>
                                <td className="px-4 py-2">Rs.{invoice.tax_amount.toFixed(2)}</td>
                                <td className="px-4 py-2">Rs.{invoice.net_amount.toFixed(2)}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleViewInvoice(invoice.id)}
                                        className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No invoices available.</p>
            )}

            {/* Pagination */}
            <div className="mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-4">{currentPage}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
                    disabled={currentPage * invoicesPerPage >= filteredInvoices.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default InvoicePage;
