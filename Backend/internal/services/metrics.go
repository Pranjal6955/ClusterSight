package services

import (
	"context"
	"fmt"
	"time"

	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"

	"clustersight-backend/internal/config"
	"clustersight-backend/internal/models"
)

type MetricsService struct {
	client   api.Client
	queryAPI v1.API
}

func NewMetricsService() *MetricsService {
	cfg := config.GetConfig()
	
	client, err := api.NewClient(api.Config{
		Address: cfg.PrometheusURL,
	})
	if err != nil {
		panic(fmt.Sprintf("Error creating Prometheus client: %v", err))
	}

	return &MetricsService{
		client:   client,
		queryAPI: v1.NewAPI(client),
	}
}

func (m *MetricsService) GetContainerMetrics() (map[string]models.ContainerMetric, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	metrics := make(map[string]models.ContainerMetric)

	// Query CPU usage
	cpuQuery := `rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100`
	cpuResult, _, err := m.queryAPI.Query(ctx, cpuQuery, time.Now())
	if err != nil {
		return nil, fmt.Errorf("error querying CPU metrics: %v", err)
	}

	// Process CPU results
	if vector, ok := cpuResult.(model.Vector); ok {
		for _, sample := range vector {
			containerName := string(sample.Metric["name"])
			containerID := string(sample.Metric["id"])
			
			if containerName == "" {
				continue
			}

			metric := metrics[containerID]
			metric.ContainerID = containerID
			metric.ContainerName = containerName
			metric.CPUUsage = float64(sample.Value)
			metrics[containerID] = metric
		}
	}

	// Query Memory usage
	memQuery := `container_memory_usage_bytes{name!=""}`
	memResult, _, err := m.queryAPI.Query(ctx, memQuery, time.Now())
	if err != nil {
		return nil, fmt.Errorf("error querying memory metrics: %v", err)
	}

	// Process Memory results
	if vector, ok := memResult.(model.Vector); ok {
		for _, sample := range vector {
			containerName := string(sample.Metric["name"])
			containerID := string(sample.Metric["id"])
			
			if containerName == "" {
				continue
			}

			metric := metrics[containerID]
			metric.ContainerID = containerID
			metric.ContainerName = containerName
			metric.MemoryUsage = float64(sample.Value)
			metrics[containerID] = metric
		}
	}

	// Query Memory limit
	memLimitQuery := `container_spec_memory_limit_bytes{name!=""}`
	memLimitResult, _, err := m.queryAPI.Query(ctx, memLimitQuery, time.Now())
	if err == nil {
		if vector, ok := memLimitResult.(model.Vector); ok {
			for _, sample := range vector {
				containerID := string(sample.Metric["id"])
				if metric, exists := metrics[containerID]; exists {
					metric.MemoryLimit = float64(sample.Value)
					metrics[containerID] = metric
				}
			}
		}
	}

	return metrics, nil
}

func (m *MetricsService) GetSingleContainerMetrics(containerID string) (*models.ContainerMetric, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	metric := &models.ContainerMetric{
		ContainerID: containerID,
	}

	// Query CPU usage for specific container
	cpuQuery := fmt.Sprintf(`rate(container_cpu_usage_seconds_total{id="%s"}[5m]) * 100`, containerID)
	cpuResult, _, err := m.queryAPI.Query(ctx, cpuQuery, time.Now())
	if err != nil {
		return nil, fmt.Errorf("error querying CPU metrics: %v", err)
	}

	if vector, ok := cpuResult.(model.Vector); ok && len(vector) > 0 {
		sample := vector[0]
		metric.ContainerName = string(sample.Metric["name"])
		metric.CPUUsage = float64(sample.Value)
	}

	// Query Memory usage for specific container
	memQuery := fmt.Sprintf(`container_memory_usage_bytes{id="%s"}`, containerID)
	memResult, _, err := m.queryAPI.Query(ctx, memQuery, time.Now())
	if err != nil {
		return nil, fmt.Errorf("error querying memory metrics: %v", err)
	}

	if vector, ok := memResult.(model.Vector); ok && len(vector) > 0 {
		metric.MemoryUsage = float64(vector[0].Value)
	}

	return metric, nil
}
