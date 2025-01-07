// package main

// import (
// 	"pizza-billing-backend/database"
// 	"pizza-billing-backend/routes"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/gofiber/fiber/v2/middleware/cors"
// )

// func main() {
// 	app := fiber.New()

// 	// ✅ CORS Middleware Configuration
// 	app.Use(cors.New(cors.Config{
// 		AllowOrigins:     "http://localhost:3000", // Allow frontend origin
// 		AllowMethods:     "GET,POST,PUT,DELETE",
// 		AllowHeaders:     "Content-Type",
// 		AllowCredentials: true,
// 	}))

// 	database.ConnectDB()
// 	routes.SetupRoutes(app)

// 	// ✅ Port Check
// 	err := app.Listen(":3002")
// 	if err != nil {
// 		panic("Failed to start server: " + err.Error())
// 	}
// }

package main

import (
	"log"
	"os"
	"os/signal"
	"pizza-billing-backend/database"
	"pizza-billing-backend/routes"
	"syscall"


	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	// ✅ CORS Middleware Configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3001", // Allow frontend origin
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	// Connect to the database
	database.ConnectDB()

	// Setup routes
	routes.SetupRoutes(app)

	// Start server
	go func() {
		err := app.Listen(":3000")
		if err != nil {
			log.Fatal("Failed to start server: " + err.Error())
		}
	}()

	// Wait for a termination signal (Ctrl+C) to gracefully shut down
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, syscall.SIGINT, syscall.SIGTERM)

	// Block until we receive a signal to shut down
	<-signalChannel
	log.Println("Received shutdown signal, gracefully shutting down...")

	// Graceful shutdown (wait for ongoing requests to finish)
	if err := app.Shutdown(); err != nil {
		log.Fatal("Error during shutdown:", err)
	}
	log.Println("Server shutdown successfully")
}
