
package controllers

import (
	"github.com/gofiber/fiber/v2"
	"pizza-billing-backend/database"
	"pizza-billing-backend/models"
)

// GetItems retrieves all items
func GetItems(c *fiber.Ctx) error {
	var items []models.Item
	if result := database.DB.Find(&items); result.Error != nil {
		return c.Status(500).SendString("Error fetching items: " + result.Error.Error())
	}
	return c.Status(200).JSON(items)
}

// GetItemByID retrieves a single item by ID
func GetItemByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var item models.Item
	if result := database.DB.First(&item, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	}
	return c.Status(200).JSON(item)
}

// CreateItem creates a new item
func CreateItem(c *fiber.Ctx) error {
	var item models.Item
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
	}
	if result := database.DB.Create(&item); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating item: " + result.Error.Error()})
	}
	return c.Status(201).JSON(fiber.Map{"message": "Item created successfully", "item": item})
}

func UpdateItem(c *fiber.Ctx) error {
    id := c.Params("id")  // Getting the id from the URL parameter

    // Check if the id is valid
    if id == "" {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid item ID provided"})
    }

    var item models.Item

    // Fetch the item using the correct column reference
    if result := database.DB.First(&item, "item_id = ?", id); result.Error != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
    }

    // Parse the request body into a new struct (prevent overwriting item_id)
    var updatedItem models.Item
    if err := c.BodyParser(&updatedItem); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Error parsing request body: " + err.Error()})
    }

    // Update the item fields while keeping the original ID
    item.Name = updatedItem.Name
    item.Description = updatedItem.Description
    item.Price = updatedItem.Price
    item.Category = updatedItem.Category
    item.ImageURL = updatedItem.ImageURL

    // Save the updated item back to the database
    if err := database.DB.Save(&item).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to update item"})
    }

    return c.Status(200).JSON(fiber.Map{"message": "Item updated successfully", "item": item})
}


// DeleteItem deletes an item by ID
func DeleteItem(c *fiber.Ctx) error {
	id := c.Params("id")
	var item models.Item
	if result := database.DB.First(&item, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	}
	database.DB.Delete(&item)
	return c.Status(200).JSON(fiber.Map{"message": "Item deleted successfully"})
}
