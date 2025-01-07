import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoiceByID } from '../../services/Api';

const ViewInvoice = () => {
  const { id } = useParams(); // Get the ID from the route
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceByID(id);
        setInvoice(data);
      } catch (err) {
        setError('Failed to fetch invoice.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!invoice) {
    return <p>No invoice found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-[#6f4f1f] mb-6">Invoice Details</h1>
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Invoice #{invoice.id}</h2>
        <p><strong>Customer Name:</strong> {invoice.customer_name}</p>
        <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> Rs.{invoice.total_amount.toFixed(2)}</p>
        <p><strong>Tax Amount:</strong> Rs.{invoice.tax_amount.toFixed(2)}</p>
        <p><strong>Net Amount:</strong> Rs.{invoice.net_amount.toFixed(2)}</p>
      </div>

      <h3 className="text-xl font-semibold mt-6">Items</h3>
      {invoice.items && invoice.items.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-[#6f4f1f] text-white">
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.item_name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">Rs.{item.price.toFixed(2)}</td>
                <td className="px-4 py-2">Rs.{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No items in this invoice.</p>
      )}
    </div>
  );
};

export default ViewInvoice;
