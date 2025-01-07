package models



type InvoiceItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	InvoiceID uint    `json:"invoice_id"`
	ItemID    uint    `json:"item_id"`                      // Link to the Item table's primary key
	ItemName  string  `json:"item_name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
	Amount    float64 `json:"amount"`
}