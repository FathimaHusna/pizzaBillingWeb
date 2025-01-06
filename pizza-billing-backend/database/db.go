// package database

// import (
// 	"log"

// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

// var DB *gorm.DB

// func ConnectDB() {
// 	dsn := "host=localhost user=postgres password=1234 dbname=pizzshop port=5432 sslmode=disable"
// 	var err error
// 	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		log.Fatal("Failed to connect to database")
// 	}
// 	log.Println("Database Connected successfully!")
// }

package database



import (
	"log"
	
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"pizza-billing-backend/models" // Import your models package
)

var DB *gorm.DB

// ConnectDB initializes the database connection
func ConnectDB() {
	dsn := "host=localhost user=postgres password=1234 dbname=shopbilling port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	log.Println("Database Connected successfully!")

	// Migrating all models together for proper foreign key handling
	err = DB.AutoMigrate(&models.Invoice{}, &models.Item{}, &models.InvoiceItem{})
	if err != nil {
		log.Fatal("Failed to migrate database schema:", err)
	}
}



