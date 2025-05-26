package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"clustersight-backend/internal/services"
)

func GetContainers(c *gin.Context) {
	dockerService := services.NewDockerService()
	
	containers, err := dockerService.ListContainers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch containers",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"containers": containers,
		"count": len(containers),
	})
}
