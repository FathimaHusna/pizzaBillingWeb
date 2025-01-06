package routes

import (
	"github.com/gofiber/fiber/v2"
	"pizza-billing-backend/controllers"
)

// SetupRoutes sets up all routes for the application
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api") // Group all routes under /api

	// Invoice Routes
	invoices := api.Group("/invoices")
	invoices.Get("/", controllers.GetInvoices)              // GET all invoices
	invoices.Post("/", controllers.CreateInvoice)           // POST create invoice
	invoices.Get("/:id", controllers.GetInvoiceByID)        // GET invoice by ID
	invoices.Put("/:id", controllers.UpdateInvoice)         // PUT update invoice by ID
	invoices.Delete("/:id", controllers.DeleteInvoice)      // DELETE invoice by ID

	// Invoice Items Nested under Invoices
	invoiceItems := invoices.Group("/:invoice_id/items")
	invoiceItems.Get("/", controllers.GetInvoiceItems)      // GET all items for a specific invoice
	invoiceItems.Post("/", controllers.CreateInvoiceItem)   // POST create item for a specific invoice
	invoiceItems.Put("/:item_id", controllers.UpdateInvoiceItem) // PUT update specific invoice item
	invoiceItems.Delete("/:item_id", controllers.DeleteInvoiceItem) // DELETE specific invoice item

	// Item Routes (Independent Items)
	items := api.Group("/items")
	items.Get("/", controllers.GetItems)                // GET all items
	items.Post("/", controllers.CreateItem)             // POST create item
	items.Get("/:id", controllers.GetItemByID)          // GET item by ID
	items.Put("/:id", controllers.UpdateItem)           // PUT update item by ID
	items.Delete("/:id", controllers.DeleteItem)        // DELETE item by ID
}
