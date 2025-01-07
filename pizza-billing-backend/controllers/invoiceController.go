
package controllers
import (
	"time"
)

import (
	"github.com/gofiber/fiber/v2"
	"pizza-billing-backend/database"
	"pizza-billing-backend/models"
	
)

// GetInvoices retrieves all invoices
func GetInvoices(c *fiber.Ctx) error {
	var invoices []models.Invoice
	if result := database.DB.Find(&invoices); result.Error != nil {
		return c.Status(500).SendString("Error fetching invoices: " + result.Error.Error())
	}
	return c.Status(200).JSON(invoices)
}

func GetInvoiceByID(c *fiber.Ctx) error {
    id := c.Params("id")

    // Fetch the invoice
    var invoice models.Invoice
    if err := database.DB.First(&invoice, id).Error; err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
    }

    // Fetch associated items
    var items []models.InvoiceItem
    if err := database.DB.Where("invoice_id = ?", id).Find(&items).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch invoice items"})
    }

    // Attach items to the invoice
    invoice.Items = items

    // Return the invoice with items
    return c.Status(200).JSON(invoice)
}


// CreateInvoice creates a new invoice
func CreateInvoice(c *fiber.Ctx) error {
	var invoice models.Invoice
	if err := c.BodyParser(&invoice); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Set default date if not provided
	if invoice.Date.IsZero() {
		invoice.Date = time.Now()
	}

	// Save invoice
	if err := database.DB.Create(&invoice).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create invoice"})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Invoice created successfully",
		"invoice": invoice,
	})
}


// UpdateInvoice updates an existing invoice by ID
func UpdateInvoice(c *fiber.Ctx) error {
	id := c.Params("id")
	var invoice models.Invoice
	if result := database.DB.First(&invoice, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
	}
	if err := c.BodyParser(&invoice); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Error parsing body: " + err.Error()})
	}
	database.DB.Save(&invoice)
	return c.Status(200).JSON(fiber.Map{"message": "Invoice updated successfully", "invoice": invoice})
}

// DeleteInvoice deletes an invoice by ID
func DeleteInvoice(c *fiber.Ctx) error {
	id := c.Params("id")
	var invoice models.Invoice
	if result := database.DB.First(&invoice, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
	}
	database.DB.Delete(&invoice)
	return c.Status(200).JSON(fiber.Map{"message": "Invoice deleted successfully"})
}
