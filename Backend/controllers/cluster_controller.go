package controllers

import (
	"net/http"

	"clustersight/models"
	"clustersight/services"

	"github.com/gin-gonic/gin"
)

type ClusterController struct {
	kubernetesService *services.KubernetesService
}

func NewClusterController(k8sService *services.KubernetesService) *ClusterController {
	return &ClusterController{
		kubernetesService: k8sService,
	}
}

func (cc *ClusterController) GetClusters(c *gin.Context) {
	clusters, err := cc.kubernetesService.GetClusters()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get clusters",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"clusters": clusters,
		"count":    len(clusters),
	})
}

func (cc *ClusterController) GetNodes(c *gin.Context) {
	clusterName := c.Param("name")
	if clusterName == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Cluster name is required",
		})
		return
	}

	nodes, err := cc.kubernetesService.GetNodes(clusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get nodes",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cluster": clusterName,
		"nodes":   nodes,
		"count":   len(nodes),
	})
}

func (cc *ClusterController) GetPods(c *gin.Context) {
	clusterName := c.Param("name")
	if clusterName == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Cluster name is required",
		})
		return
	}

	pods, err := cc.kubernetesService.GetPods(clusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get pods",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cluster": clusterName,
		"pods":    pods,
		"count":   len(pods),
	})
}

func (cc *ClusterController) GetMetrics(c *gin.Context) {
	clusterName := c.Param("name")
	if clusterName == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Cluster name is required",
		})
		return
	}

	metrics, err := cc.kubernetesService.GetMetrics(clusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get metrics",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, metrics)
}

func (cc *ClusterController) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "ClusterSight API",
		"version": "1.0.0",
	})
}
