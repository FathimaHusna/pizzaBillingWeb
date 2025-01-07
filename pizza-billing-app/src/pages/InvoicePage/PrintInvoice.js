import React from "react";

const PrintInvoice = ({ invoice }) => {
    if (!invoice) {
        return <p className="text-center text-gray-500">No invoice data available to print.</p>;
    }

    const {
        customer_name,
        date,
        total_amount = 0,
        tax_amount = 0,
        net_amount = 0,
        items = [],
    } = invoice;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg border border-gray-300 print:max-w-full print:shadow-none print:border-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#6f4f1f]">Invoice</h1>
                    <p className="text-gray-500">Thank you for your business!</p>
                </div>
                
            </div>

            {/* Customer Info */}
            <div className="mb-4">
                <p className="text-lg">
                    <strong>Customer Name:</strong> {customer_name}
                </p>
                <p className="text-lg">
                    <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                </p>
            </div>

            {/* Invoice Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-[#6f4f1f] text-white">
                        <tr>
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{item.item_name}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">Rs.{item.price?.toFixed(2) || "0.00"}</td>
                                    <td className="px-4 py-2">Rs.{item.amount?.toFixed(2) || "0.00"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center px-4 py-2 text-gray-500">
                                    No items in the invoice.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="mt-6 text-right">
                <p className="text-lg">
                    <strong>Total Amount:</strong> Rs.{total_amount.toFixed(2)}
                </p>
                <p className="text-lg">
                    <strong>Tax Amount:</strong> Rs.{tax_amount.toFixed(2)}
                </p>
                <p className="text-lg font-bold">
                    <strong>Net Amount:</strong> Rs.{net_amount.toFixed(2)}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center border-t border-gray-300 pt-4">
                <p className="text-gray-500">
                    If you have any questions about this invoice, please contact us at{" "}
                    <a href="mailto:info@example.com" className="text-blue-500 underline">
                        info@example.com
                    </a>.
                </p>
            </div>

            {/* Print Button */}
            <div className="mt-4 text-center print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-600"
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
};

export default PrintInvoice;
