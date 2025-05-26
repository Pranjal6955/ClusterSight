package handlers

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Simple metrics response for frontend compatibility
type SimpleMetricsResponse struct {
	CPU    float64 `json:"cpu"`
	Memory float64 `json:"memory"`
}

func GetMetrics(c *gin.Context) {
	// For now, provide mock data that matches frontend expectations
	// This ensures the dashboard works immediately

	// Generate realistic mock data
	rand.Seed(time.Now().UnixNano())

	response := SimpleMetricsResponse{
		CPU:    20 + rand.Float64()*60, // 20-80% range
		Memory: 30 + rand.Float64()*50, // 30-80% range
	}

	c.JSON(http.StatusOK, response)
}

func GetContainerMetrics(c *gin.Context) {
	containerID := c.Param("id")
	if containerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Container ID is required"})
		return
	}

	// Mock container-specific metrics
	rand.Seed(time.Now().UnixNano())

	response := SimpleMetricsResponse{
		CPU:    10 + rand.Float64()*70,
		Memory: 25 + rand.Float64()*55,
	}

	c.JSON(http.StatusOK, response)
}
