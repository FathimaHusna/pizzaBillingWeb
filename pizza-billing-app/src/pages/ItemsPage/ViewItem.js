import React from 'react';

const ViewItem = ({ item, startEditing }) => (
    <>
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-700 mb-2">{item.category}</p>
        <p className="text-gray-700 mb-2">{item.description}</p>
        <p className="text-lg font-semibold text-[#6f4f1f]">Rs. {item.price}</p>
        <p className="text-sm text-gray-500">
            Created: {new Date(item.created_at).toLocaleDateString()}
        </p>
        <div className="mt-4 flex space-x-4">
            <button
                onClick={() => startEditing(item)}
                className="text-white bg-[#8b5d33] px-4 py-2 rounded-lg hover:bg-[#6f4f1f]"
            >
                Edit
            </button>
            <button className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
                Delete
            </button>
        </div>
    </>
);

export default ViewItem;
