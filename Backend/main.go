package main

import (
	"fmt"
	"log"
	"net"
	"os"

	"clustersight/routes"
	"clustersight/services"
)

func findAvailablePort(startPort int) string {
	for port := startPort; port <= startPort+10; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return fmt.Sprintf("%d", port)
		}
	}
	return fmt.Sprintf("%d", startPort) // fallback to original port
}

func main() {
	// Initialize Kubernetes service
	k8sService := services.NewKubernetesService()

	// Initialize Kubernetes clients
	if err := k8sService.InitializeClients(); err != nil {
		log.Printf("Warning: Failed to initialize Kubernetes clients: %v", err)
		log.Println("Make sure your kubeconfig is properly configured")
	}

	// Get port from environment variable or find available port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Check if port is available, if not find an alternative
	ln, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Printf("Port %s is in use, finding alternative...", port)
		port = findAvailablePort(8080)
		log.Printf("Using port %s instead", port)
	} else {
		ln.Close()
	}

	// Setup routes
	router := routes.SetupRoutes(k8sService)

	// Update server address to use the determined port
	serverAddr := fmt.Sprintf(":%s", port)

	// Start server
	log.Printf("Starting ClusterSight API server on %s", serverAddr)
	log.Printf("Access the API at: http://localhost:%s", port)
	log.Println("API endpoints:")
	log.Printf("  GET http://localhost:%s/api/v1/health", port)
	log.Printf("  GET http://localhost:%s/api/v1/clusters", port)
	log.Printf("  GET http://localhost:%s/api/v1/clusters/:name/nodes", port)
	log.Printf("  GET http://localhost:%s/api/v1/clusters/:name/pods", port)
	log.Printf("  GET http://localhost:%s/api/v1/clusters/:name/metrics", port)

	if err := router.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
