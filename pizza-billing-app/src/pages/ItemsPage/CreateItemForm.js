import React, { useState } from "react";
import { createItem } from "../../services/Api"; // Assuming the api.js is in the same directory

const CreateItemForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // 'success' or 'error'

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = {
            name,
            description,
            price: parseFloat(price), // Make sure price is a number
            category,
            image_url: imageUrl,
        };

        try {
            const result = await createItem(newItem);
            console.log("Item created successfully:", result);
            setAlertMessage("Item created successfully!");
            setAlertType("success");
        } catch (error) {
            console.error("Error creating item:", error);
            setAlertMessage("Error creating item. Please try again.");
            setAlertType("error");
        }
    };

    return (
        <div className="max-w-lg mx-auto my-8 p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Create New Item</h2>
            
            {/* Display Alert */}
            {alertMessage && (
               <div
               className={`mb-6 p-4 rounded-lg text-center ${
                   alertType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
               }`}
           >
               {alertMessage}
           </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Item Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] focus:border-[#6f4f1f] transition duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] focus:border-[#6f4f1f] transition duration-200"
                    />
                </div>

                <div className="space-y-2">
  <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
    Price
  </label>
  <input
    type="number"
    id="price"
    value={price}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        setPrice(value);
      }
    }}
    min="0"
    required
    className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] focus:border-[#6f4f1f] transition duration-200"
  />
</div>


                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] focus:border-[#6f4f1f] transition duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700">Image URL</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] focus:border-[#6f4f1f] transition duration-200"
                    />
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-[#6f4f1f] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#8b5d33] focus:outline-none focus:ring-2 focus:ring-[#6f4f1f] transition duration-300"
                    >
                        Create Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateItemForm;
