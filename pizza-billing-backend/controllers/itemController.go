// package controllers

// import (
// 	"github.com/gofiber/fiber/v2"
// 	"pizza-billing-backend/database"
// 	"pizza-billing-backend/models"
	
// )
// import (
// 	"fmt"
// )

// // GetItems retrieves all items from the database
// func GetItems(c *fiber.Ctx) error {
// 	var items []models.Item
// 	if result := database.DB.Find(&items); result.Error != nil {
// 		return c.Status(500).SendString("Error fetching items: " + result.Error.Error())
// 	}
// 	return c.Status(200).JSON(items)
// }

// // GetItemByID retrieves a single item by ID
// func GetItemByID(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var item models.Item
// 	if result := database.DB.First(&item, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
// 	}
// 	return c.Status(200).JSON(item)
// }

// // CreateItem handles adding a new item to the database
// func CreateItem(c *fiber.Ctx) error {
// 	var item models.Item

// 	if err := c.BodyParser(&item); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
// 	}

// 	if err := validateItem(item); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	if result := database.DB.Create(&item); result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Error creating item: " + result.Error.Error()})
// 	}

// 	return c.Status(201).JSON(fiber.Map{
// 		"message": "Item created successfully",
// 		"item":    item,
// 	})
// }

// // UpdateItem updates an existing item by ID
// func UpdateItem(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	fmt.Println("Updating item with ID:", id)
// 	var item models.Item

// 	if result := database.DB.First(&item, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
// 	}

// 	if err := c.BodyParser(&item); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
// 	}

// 	if err := validateItem(item); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	database.DB.Save(&item)
// 	return c.Status(200).JSON(fiber.Map{
// 		"message": "Item updated successfully",
// 		"item":    item,
// 	})
// }

// // DeleteItem deletes an item by ID
// func DeleteItem(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var item models.Item

// 	if result := database.DB.First(&item, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
// 	}

// 	database.DB.Delete(&item)
// 	return c.Status(200).JSON(fiber.Map{"message": "Item deleted successfully"})
// }

// // validateItem checks the required fields for item creation
// func validateItem(item models.Item) error {
// 	if item.Price <= 0 {
// 		return fiber.NewError(fiber.StatusBadRequest, "Price must be a positive number.")
// 	}
// 	if item.Name == "" {
// 		return fiber.NewError(fiber.StatusBadRequest, "Item name is required.")
// 	}
// 	if item.Description == "" {
// 		return fiber.NewError(fiber.StatusBadRequest, "Item description is required.")
// 	}
// 	if item.Category == "" {
// 		return fiber.NewError(fiber.StatusBadRequest, "Item category is required.")
// 	}
// 	return nil
// }

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

// UpdateItem updates an existing item by ID
func UpdateItem(c *fiber.Ctx) error {
	id := c.Params("id")
	var item models.Item
	if result := database.DB.First(&item, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	}
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
	}
	database.DB.Save(&item)
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
