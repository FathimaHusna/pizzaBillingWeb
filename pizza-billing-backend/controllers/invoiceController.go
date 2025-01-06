// package controllers

// import (
// 	"github.com/gofiber/fiber/v2"
// 	"pizza-billing-backend/database"
// 	"pizza-billing-backend/models"
// )

// // GetInvoices retrieves all invoices
// func GetInvoices(c *fiber.Ctx) error {
// 	var invoices []models.Invoice
// 	if result := database.DB.Find(&invoices); result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Error fetching invoices: " + result.Error.Error()})
// 	}
// 	return c.Status(200).JSON(invoices)
// }

// // GetInvoiceByID retrieves a single invoice by ID
// func GetInvoiceByID(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var invoice models.Invoice
// 	if result := database.DB.First(&invoice, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
// 	}
// 	return c.Status(200).JSON(invoice)
// }

// // // CreateInvoice handles creating a new invoice
// // func CreateInvoice(c *fiber.Ctx) error {
// // 	var invoice models.Invoice
// // 	if err := c.BodyParser(&invoice); err != nil {
// // 		return c.Status(400).JSON(fiber.Map{"error": "Error parsing request body: " + err.Error()})
// // 	}
// // 	if err := validateInvoice(invoice); err != nil {
// // 		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
// // 	}
// // 	if invoice.TaxAmount == 0 {
// // 		invoice.TaxAmount = invoice.TotalAmount * 0.10
// // 	}
// // 	invoice.NetAmount = invoice.TotalAmount + invoice.TaxAmount
// // 	if result := database.DB.Create(&invoice); result.Error != nil {
// // 		return c.Status(500).JSON(fiber.Map{"error": "Error creating invoice: " + result.Error.Error()})
// // 	}
// // 	return c.Status(201).JSON(fiber.Map{"message": "Invoice created successfully", "invoice": invoice})
// // }

// // UpdateInvoice handles updating an invoice by ID
// func UpdateInvoice(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var invoice models.Invoice
// 	if result := database.DB.First(&invoice, id); result.Error != nil {
// 		return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
// 	}
// 	if err := c.BodyParser(&invoice); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Error parsing request body: " + err.Error()})
// 	}
// 	if result := database.DB.Save(&invoice); result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Error updating invoice: " + result.Error.Error()})
// 	}
// 	return c.Status(200).JSON(fiber.Map{"message": "Invoice updated successfully", "invoice": invoice})
// }

// // DeleteInvoice handles deleting an invoice by ID
// func DeleteInvoice(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	if result := database.DB.Delete(&models.Invoice{}, id); result.Error != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Error deleting invoice: " + result.Error.Error()})
// 	}
// 	return c.Status(200).JSON(fiber.Map{"message": "Invoice deleted successfully"})
// }

// // validateInvoice checks for required fields and data integrity
// func validateInvoice(invoice models.Invoice) error {
// 	if invoice.CustomerName == "" {
// 		return fiber.NewError(fiber.StatusBadRequest, "Customer name is required.")
// 	}
// 	if invoice.TotalAmount <= 0 {
// 		return fiber.NewError(fiber.StatusBadRequest, "Total amount must be greater than zero.")
// 	}
// 	return nil
// }
// // CreateInvoice handles creating a new invoice along with its items
// func CreateInvoice(c *fiber.Ctx) error {
// 	// Parse the incoming body into the Invoice struct
// 	var invoice models.Invoice
// 	if err := c.BodyParser(&invoice); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": "Error parsing request body: " + err.Error()})
// 	}

// 	// Validate the Invoice fields
// 	if err := validateInvoice(invoice); err != nil {
// 		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	// Calculate tax and net amount if not provided
// 	if invoice.TaxAmount == 0 {
// 		invoice.TaxAmount = invoice.TotalAmount * 0.10
// 	}
// 	invoice.NetAmount = invoice.TotalAmount + invoice.TaxAmount

// 	// Start a database transaction
// 	tx := database.DB.Begin()

// 	// Ensure the transaction is rolled back in case of an error
// 	defer func() {
// 		if r := recover(); r != nil {
// 			tx.Rollback()
// 		}
// 	}()

// 	// Create the Invoice in the database
// 	if result := tx.Create(&invoice); result.Error != nil {
// 		tx.Rollback()
// 		return c.Status(500).JSON(fiber.Map{"error": "Error creating invoice: " + result.Error.Error()})
// 	}

// 	// Insert Invoice Items
// 	for _, item := range invoice.Items {
// 		item.InvoiceID = invoice.InvoiceID // Link the invoice item to the invoice

// 		// Insert each item into the database within the same transaction
// 		if result := tx.Create(&item); result.Error != nil {
// 			tx.Rollback()
// 			return c.Status(500).JSON(fiber.Map{"error": "Error creating invoice item: " + result.Error.Error()})
// 		}
// 	}

// 	// Commit the transaction if everything is successful
// 	tx.Commit()

// 	// Return success response with the created invoice
// 	return c.Status(201).JSON(fiber.Map{
// 		"message": "Invoice created successfully",
// 		"invoice": invoice,
// 	})
// }


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

// GetInvoiceByID retrieves a single invoice by ID
func GetInvoiceByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var invoice models.Invoice
	if result := database.DB.First(&invoice, id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invoice not found"})
	}
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
