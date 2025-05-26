package routes

import (
	"clustersight/controllers"
	"clustersight/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(k8sService *services.KubernetesService) *gin.Engine {
	router := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:8081"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// Initialize controller
	clusterController := controllers.NewClusterController(k8sService)

	// API routes
	api := router.Group("/api/v1")
	{
		// Health check
		api.GET("/health", clusterController.HealthCheck)
		
		// Cluster routes
		api.GET("/clusters", clusterController.GetClusters)
		api.GET("/clusters/:name/nodes", clusterController.GetNodes)
		api.GET("/clusters/:name/pods", clusterController.GetPods)
		api.GET("/clusters/:name/metrics", clusterController.GetMetrics)
	}

	return router
}
