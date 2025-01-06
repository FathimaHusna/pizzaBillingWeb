package models

// InvoiceItem represents the invoice_items table in the database
// type InvoiceItem struct {
// 	InvoiceItemID uint    `json:"invoice_item_id" gorm:"primaryKey;autoIncrement"`
// 	InvoiceID     uint    `json:"invoice_id"` // Reference to an invoice
// 	ItemID        uint    `json:"item_id"`    // Reference to an item
// 	Quantity      int     `json:"quantity"`
// 	Price         float64 `json:"price"`
// 	TotalPrice    float64 `json:"total_price"`
// }

type InvoiceItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	InvoiceID uint    `json:"invoice_id"`
	ItemID    uint    `json:"item_id"`                      // Link to the Item table's primary key
	ItemName  string  `json:"item_name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Amount    float64 `json:"amount"`
}