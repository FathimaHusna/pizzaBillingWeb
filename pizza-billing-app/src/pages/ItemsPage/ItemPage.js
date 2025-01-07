import React, { useEffect, useState } from 'react';
import { getItems, updateItem, deleteItem, getItemById } from '../../services/Api';
import { useNavigate } from "react-router-dom";

const ItemsPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [isEditing, setIsEditing] = useState(null);
    const [editedItem, setEditedItem] = useState({
        id: '', name: '', description: '', price: '', category: '', image_url: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        getItems()
            .then((fetchedItems) => {
                setItems(fetchedItems);
                setFilteredItems(fetchedItems);
            })
            .catch(console.error);
    }, []);

    // Apply Filters
    useEffect(() => {
        let updatedItems = items;

        if (searchTerm) {
            updatedItems = updatedItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedCategory) {
            updatedItems = updatedItems.filter(item => item.category === selectedCategory);
        }

        updatedItems = updatedItems.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        setFilteredItems(updatedItems);
        setCurrentPage(1); // Reset to first page after filtering
    }, [searchTerm, selectedCategory, priceRange, items]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddNewItem = () => navigate("/create-item");

    const handleUpdate = async (id) => {
        try {
            const updatedItem = { ...editedItem, price: parseFloat(editedItem.price) };
            await updateItem(id, updatedItem);
            alert('Item updated successfully');
            getItems().then(setItems);
            setIsEditing(null);
        } catch (error) {
            alert('Error updating item');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            alert('Error deleting item');
        }
    };

    const startEditing = (item) => {
        setIsEditing(item.id);
        setEditedItem(item);
    };

    const handleImageClick = async (id) => {
        try {
            await getItemById(id);
            navigate(`/item/${id}`);
        } catch (error) {
            console.error('Error fetching item:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f1e1] py-12 px-6 text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-[#6f4f1f]">Pizza Items</h1>
                <button onClick={handleAddNewItem} className="bg-[#6f4f1f] text-white px-6 py-3 rounded-lg hover:bg-[#8b5d33]">
                    + Add New Item
                </button>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded"
                />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded">
                    <option value="">All Categories</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Toppings">Toppings</option>
                    <option value="Beverages">Beverages</option>
                </select>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto appearance-none h-2 rounded-full bg-[#6f4f1f] accent-[#6f4f1f]"
                />
                <span>Up to Rs. {priceRange[1]}</span>
            </div>

            {/* Items Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {currentItems.map((item) => (
                    <div key={item.id} className="p-6 border rounded-lg shadow-md bg-white">
                        <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                            onClick={() => handleImageClick(item.id)}
                        />
                        {isEditing === item.id ? (
                            <>
                                <div className="space-y-2">
    {/* Name */}
    <input 
        value={editedItem.name} 
        onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })} 
        placeholder="Name"
        className="w-full p-2 border rounded mb-2"
    />
    
    {/* Description */}
    <input 
        value={editedItem.description} 
        onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })} 
        placeholder="Description"
        className="w-full p-2 border rounded mb-2"
    />
    
    {/* Price */}
    <input 
        type="number"
        value={editedItem.price} 
        onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) || 0 })} 
        placeholder="Price"
        className="w-full p-2 border rounded mb-2"
    />
    
    {/* Category */}
    <input 
        value={editedItem.category} 
        onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })} 
        placeholder="Category"
        className="w-full p-2 border rounded mb-2"
    />
    
    {/* Image URL */}
    <input 
        value={editedItem.image_url} 
        onChange={(e) => setEditedItem({ ...editedItem, image_url: e.target.value })} 
        placeholder="Image URL"
        className="w-full p-2 border rounded mb-2"
    />
</div>

                                <button onClick={() => handleUpdate(item.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
                                <button onClick={() => setIsEditing(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold">{item.name}</h3>
                                <p>{item.category}</p>
                                <p>Rs. {item.price}</p>
                                <button onClick={() => startEditing(item)} className="bg-[#8b5d33] text-white px-6 py-2 rounded-lg mt-2">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2">Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={`px-4 py-2 mx-1 rounded ${currentPage === i + 1 ? 'bg-[#6f4f1f] text-white' : 'bg-gray-200'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ItemsPage;
