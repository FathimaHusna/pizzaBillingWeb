
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
