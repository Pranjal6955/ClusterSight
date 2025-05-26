package models

import "time"

type ContainerInfo struct {
	ID      string            `json:"id"`
	Name    string            `json:"name"`
	Image   string            `json:"image"`
	Status  string            `json:"status"`
	State   string            `json:"state"`
	Ports   []PortMapping     `json:"ports"`
	Labels  map[string]string `json:"labels"`
	Created int64             `json:"created"`
}

type PortMapping struct {
	PrivatePort int    `json:"private_port"`
	PublicPort  int    `json:"public_port,omitempty"`
	Type        string `json:"type"`
	IP          string `json:"ip,omitempty"`
}

type ContainerMetric struct {
	ContainerID   string  `json:"container_id"`
	ContainerName string  `json:"container_name"`
	CPUUsage      float64 `json:"cpu_usage_percent"`
	MemoryUsage   float64 `json:"memory_usage_bytes"`
	MemoryLimit   float64 `json:"memory_limit_bytes"`
	NetworkRx     float64 `json:"network_rx_bytes"`
	NetworkTx     float64 `json:"network_tx_bytes"`
}

type MetricsResponse struct {
	Timestamp time.Time                 `json:"timestamp"`
	Metrics   map[string]ContainerMetric `json:"metrics"`
}
