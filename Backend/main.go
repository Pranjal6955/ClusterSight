package main

import (
	"fmt"
	"log"
	"os"

	"clustersight/routes"
	"clustersight/services"
)

func main() {
	// Initialize Kubernetes service
	k8sService := services.NewKubernetesService()

	// Initialize Kubernetes clients
	if err := k8sService.InitializeClients(); err != nil {
		log.Printf("Warning: Failed to initialize Kubernetes clients: %v", err)
		log.Println("Make sure your kubeconfig is properly configured")
	}

	// Setup routes
	router := routes.SetupRoutes(k8sService)

	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Update server address to use the port from environment
	serverAddr := fmt.Sprintf(":%s", port)

	// Start server
	log.Printf("Starting ClusterSight API server on %s", serverAddr)
	log.Println("API endpoints:")
	log.Println("  GET /api/v1/health")
	log.Println("  GET /api/v1/clusters")
	log.Println("  GET /api/v1/clusters/:name/nodes")
	log.Println("  GET /api/v1/clusters/:name/pods")
	log.Println("  GET /api/v1/clusters/:name/metrics")

	if err := router.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server:%v", err)
	}
}
