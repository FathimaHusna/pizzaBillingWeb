// // package controllers

// // import (
// // 	"log"
// // 	"github.com/gofiber/fiber/v2"
// // 	"pizza-billing-backend/database"
// // 	"pizza-billing-backend/models"
// // )

// // // GetInvoiceItems retrieves all invoice items
// // func GetInvoiceItems(c *fiber.Ctx) error {
// // 	var invoiceItems []models.InvoiceItem
// // 	if result := database.DB.Find(&invoiceItems); result.Error != nil {
// // 		log.Printf("Error fetching invoice items: %v", result.Error)
// // 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": result.Error.Error()})
// // 	}
// // 	return c.Status(200).JSON(fiber.Map{
// // 		"status": "success",
// // 		"data":   invoiceItems,
// // 	})
// // }

// // // GetInvoiceItemByID retrieves a single invoice item by ID
// // func GetInvoiceItemByID(c *fiber.Ctx) error {
// // 	id := c.Params("id")
// // 	var invoiceItem models.InvoiceItem
// // 	if result := database.DB.First(&invoiceItem, id); result.Error != nil {
// // 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Invoice item not found"})
// // 	}
// // 	return c.Status(200).JSON(fiber.Map{"status": "success", "data": invoiceItem})
// // }

// // // CreateInvoiceItem creates a new invoice item
// // func CreateInvoiceItem(c *fiber.Ctx) error {
// // 	var invoiceItem models.InvoiceItem

// // 	if err := c.BodyParser(&invoiceItem); err != nil {
// // 		log.Printf("Error parsing request body: %v", err)
// // 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Failed to parse body: " + err.Error()})
// // 	}

// // 	if invoiceItem.Quantity <= 0 || invoiceItem.Price <= 0 {
// // 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Quantity and Price must be greater than 0"})
// // 	}

// // 	if result := database.DB.Create(&invoiceItem); result.Error != nil {
// // 		log.Printf("Error creating invoice item: %v", result.Error)
// // 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Error creating invoice item: " + result.Error.Error()})
// // 	}

// // 	return c.Status(201).JSON(fiber.Map{"status": "success", "message": "Invoice item created successfully", "item": invoiceItem})
// // }

// // // UpdateInvoiceItem updates an existing invoice item
// // func UpdateInvoiceItem(c *fiber.Ctx) error {
// // 	id := c.Params("id")
// // 	var invoiceItem models.InvoiceItem

// // 	if result := database.DB.First(&invoiceItem, id); result.Error != nil {
// // 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Invoice item not found"})
// // 	}

// // 	if err := c.BodyParser(&invoiceItem); err != nil {
// // 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Failed to parse body: " + err.Error()})
// // 	}

// // 	if invoiceItem.Quantity <= 0 || invoiceItem.Price <= 0 {
// // 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Quantity and Price must be greater than 0"})
// // 	}

// // 	database.DB.Save(&invoiceItem)
// // 	return c.Status(200).JSON(fiber.Map{"status": "success", "message": "Invoice item updated successfully", "data": invoiceItem})
// // }

// // // DeleteInvoiceItem deletes an invoice item by ID
// // func DeleteInvoiceItem(c *fiber.Ctx) error {
// // 	id := c.Params("id")
// // 	if result := database.DB.Delete(&models.InvoiceItem{}, id); result.Error != nil {
// // 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Error deleting invoice item: " + result.Error.Error()})
// // 	}
// // 	return c.Status(200).JSON(fiber.Map{"status": "success", "message": "Invoice item deleted successfully"})
// // }

// package controllers

// import (
// 	"log"
// 	"github.com/gofiber/fiber/v2"
// 	"pizza-billing-backend/database"
// 	"pizza-billing-backend/models"
	
// )

// // GetInvoiceItems retrieves all invoice items
// func GetInvoiceItems(c *fiber.Ctx) error {
// 	var invoiceItems []models.InvoiceItem
// 	if result := database.DB.Find(&invoiceItems); result.Error != nil {
// 		log.Printf("Error fetching invoice items: %v", result.Error)
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": result.Error.Error()})
// 	}
// 	return c.Status(200).JSON(fiber.Map{
// 		"status": "success",
// 		"data":   invoiceItems,
// 	})
// }

// // GetInvoiceItemByID retrieves a single invoice item by ID
// func GetInvoiceItemByID(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var invoiceItem models.InvoiceItem
// 	if result := database.DB.First(&invoiceItem, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Invoice item not found"})
// 	}
// 	return c.Status(200).JSON(fiber.Map{"status": "success", "data": invoiceItem})
// }

// // CreateInvoiceItem creates a new invoice item
// func CreateInvoiceItem(c *fiber.Ctx) error {
// 	var invoiceItem models.InvoiceItem

// 	// Parse the request body to fill the invoiceItem
// 	if err := c.BodyParser(&invoiceItem); err != nil {
// 		log.Printf("Error parsing request body: %v", err)
// 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Failed to parse body: " + err.Error()})
// 	}

// 	// Validate Quantity and Price
// 	if invoiceItem.Quantity <= 0 || invoiceItem.Price <= 0 {
// 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Quantity and Price must be greater than 0"})
// 	}

// 	// Start a transaction
// 	tx := database.DB.Begin()

// 	// Check if the associated invoice exists
// 	var invoice models.Invoice
// 	if result := tx.First(&invoice, invoiceItem.InvoiceID); result.Error != nil {
// 		tx.Rollback() // Rollback transaction in case of error
// 		log.Printf("Invoice not found: %v", result.Error)
// 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invoice not found"})
// 	}

// 	// Calculate the total amount for the item
// 	invoiceItem.Amount = float64(invoiceItem.Quantity) * invoiceItem.Price

// 	// Insert the invoice item into the database
// 	if result := tx.Create(&invoiceItem); result.Error != nil {
// 		tx.Rollback() // Rollback transaction in case of error
// 		log.Printf("Error creating invoice item: %v", result.Error)
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Error creating invoice item: " + result.Error.Error()})
// 	}

// 	// Commit the transaction
// 	tx.Commit()

// 	return c.Status(201).JSON(fiber.Map{"status": "success", "message": "Invoice item created successfully", "item": invoiceItem})
// }

// // UpdateInvoiceItem updates an existing invoice item
// func UpdateInvoiceItem(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var invoiceItem models.InvoiceItem

// 	// Check if the invoice item exists
// 	if result := database.DB.First(&invoiceItem, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Invoice item not found"})
// 	}

// 	// Parse the updated request body
// 	if err := c.BodyParser(&invoiceItem); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Failed to parse body: " + err.Error()})
// 	}

// 	// Validate Quantity and Price
// 	if invoiceItem.Quantity <= 0 || invoiceItem.Price <= 0 {
// 		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Quantity and Price must be greater than 0"})
// 	}

// 	// Recalculate the total amount for the item
// 	invoiceItem.Amount = float64(invoiceItem.Quantity) * invoiceItem.Price

// 	// Save the updated invoice item
// 	if result := database.DB.Save(&invoiceItem); result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Error updating invoice item: " + result.Error.Error()})
// 	}

// 	return c.Status(200).JSON(fiber.Map{"status": "success", "message": "Invoice item updated successfully", "data": invoiceItem})
// }

// // DeleteInvoiceItem deletes an invoice item by ID
// func DeleteInvoiceItem(c *fiber.Ctx) error {
// 	id := c.Params("id")

// 	// Start a transaction
// 	tx := database.DB.Begin()

// 	// Check if the invoice item exists
// 	var invoiceItem models.InvoiceItem
// 	if result := tx.First(&invoiceItem, id); result.Error != nil {
// 		tx.Rollback() // Rollback transaction in case of error
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Invoice item not found"})
// 	}

// 	// Delete the invoice item
// 	if result := tx.Delete(&models.InvoiceItem{}, id); result.Error != nil {
// 		tx.Rollback() // Rollback transaction in case of error
// 		log.Printf("Error deleting invoice item: %v", result.Error)
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Error deleting invoice item: " + result.Error.Error()})
// 	}

// 	// Commit the transaction
// 	tx.Commit()

// 	return c.Status(200).JSON(fiber.Map{"status": "success", "message": "Invoice item deleted successfully"})
// }

package controllers
import (
	"github.com/gofiber/fiber/v2"
	"pizza-billing-backend/database"
	"pizza-billing-backend/models"
	"strconv"
)



// GetInvoiceItems retrieves all items for a specific invoice
func GetInvoiceItems(c *fiber.Ctx) error {
	invoiceID := c.Params("invoice_id")
	var items []models.InvoiceItem
	if result := database.DB.Where("invoice_id = ?", invoiceID).Find(&items); result.Error != nil {
		return c.Status(500).SendString("Error fetching items: " + result.Error.Error())
	}
	return c.Status(200).JSON(items)
}

// GetInvoiceItemByID retrieves a single item by ID for a specific invoice
func GetInvoiceItemByID(c *fiber.Ctx) error {
	invoiceID := c.Params("invoice_id")
	itemID := c.Params("item_id")
	var item models.InvoiceItem
	if result := database.DB.Where("invoice_id = ? AND id = ?", invoiceID, itemID).First(&item); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice Item not found"})
	}
	return c.Status(200).JSON(item)
}

// CreateInvoiceItem adds a new item to a specific invoice


func CreateInvoiceItem(c *fiber.Ctx) error {
    var item models.InvoiceItem

    // Parse the JSON request body
    if err := c.BodyParser(&item); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
    }

    // Capture and convert invoice_id from the URL parameter
    invoiceID := c.Params("invoice_id")
    invoiceIDUint, err := strconv.ParseUint(invoiceID, 10, 32)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid invoice ID"})
    }

    // Assign the converted invoiceID to the InvoiceID field
    item.InvoiceID = uint(invoiceIDUint)

    // Check if the invoice exists before creating the item
    var invoice models.Invoice
    if err := database.DB.First(&invoice, item.InvoiceID).Error; err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
    }

    // Create the invoice item in the database
    if result := database.DB.Create(&item); result.Error != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Error creating invoice item: " + result.Error.Error()})
    }

    // Return success response
    return c.Status(201).JSON(fiber.Map{"message": "Invoice item created successfully", "item": item})
}



// UpdateInvoiceItem updates an existing item within an invoice
func UpdateInvoiceItem(c *fiber.Ctx) error {
	invoiceID := c.Params("invoice_id")
	itemID := c.Params("item_id")
	var item models.InvoiceItem
	if result := database.DB.Where("invoice_id = ? AND id = ?", invoiceID, itemID).First(&item); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice Item not found"})
	}
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
	}
	database.DB.Save(&item)
	return c.Status(200).JSON(fiber.Map{"message": "Invoice item updated successfully", "item": item})
}

// DeleteInvoiceItem deletes an item from a specific invoice
func DeleteInvoiceItem(c *fiber.Ctx) error {
	invoiceID := c.Params("invoice_id")
	itemID := c.Params("item_id")
	var item models.InvoiceItem
	if result := database.DB.Where("invoice_id = ? AND id = ?", invoiceID, itemID).First(&item); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice Item not found"})
	}
	database.DB.Delete(&item)
	return c.Status(200).JSON(fiber.Map{"message": "Invoice item deleted successfully"})
}
