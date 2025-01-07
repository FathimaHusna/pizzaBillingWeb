import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the ID from the URL
import { getItemById } from '../../services/Api'; // Adjust based on your file structure

const ItemDetailPage = () => {
    const { id } = useParams(); // Get the item ID from the URL
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await getItemById(id); // Fetch item details by ID
                setItem(data);
            } catch (err) {
                setError('Item not found');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]); // Fetch item whenever the ID changes

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <div className="flex flex-col md:flex-row items-center space-x-6">
                <div className="w-full md:w-1/3">
                    <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{item.description}</p>
                    <p className="text-xl text-gray-800 mb-4">
                        <span className="font-semibold">Price: </span>${item.price}
                    </p>
                    <p className="text-lg text-gray-700">
                        <span className="font-semibold">Category: </span>{item.category}
                    </p>
                    <div className="mt-6">
                        <a
                            href="/items"
                            className="inline-block bg-[#6f4f1f] text-white px-6 py-3 rounded-lg hover:bg-[#8b5d33] transition duration-300"
                        >
                            Back to Items
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;
