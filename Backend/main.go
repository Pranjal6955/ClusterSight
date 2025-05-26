package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"clustersight-backend/internal/handlers"
	"clustersight-backend/internal/middleware"
)

func main() {
	// Create Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://frontend:3000", "*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Apply custom middleware
	r.Use(middleware.Logger())
	r.Use(middleware.ErrorHandler())

	// Health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes - Frontend expects /api/metrics
	api := r.Group("/api")
	{
		api.GET("/metrics", handlers.GetMetrics)
		api.GET("/containers", handlers.GetContainers)
		api.GET("/containers/:id/metrics", handlers.GetContainerMetrics)
	}

	// Start server
	log.Println("Server starting on port 8081...")
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
