package models

import "time"



type Invoice struct {
    InvoiceID    uint          `json:"id" gorm:"primaryKey"`
    CustomerName string        `json:"customer_name"`
    Date         time.Time     `json:"date"`
    TotalAmount  float64       `json:"total_amount"`
    TaxAmount    float64       `json:"tax_amount"`
    NetAmount    float64       `json:"net_amount"`
    CreatedAt    time.Time     `json:"created_at" gorm:"autoCreateTime"`
    UpdatedAt    time.Time     `json:"updated_at" gorm:"autoUpdateTime"`
    Items []InvoiceItem        `json:"items" gorm:"foreignKey:InvoiceID"` 
}
