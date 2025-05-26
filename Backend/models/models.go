package models

import "time"

type Cluster struct {
	Name    string `json:"name"`
	Status  string `json:"status"`
	Version string `json:"version"`
}

type Node struct {
	Name         string            `json:"name"`
	Status       string            `json:"status"`
	Roles        []string          `json:"roles"`
	Age          string            `json:"age"`
	Version      string            `json:"version"`
	InternalIP   string            `json:"internal_ip"`
	ExternalIP   string            `json:"external_ip"`
	Capacity     map[string]string `json:"capacity"`
	Allocatable  map[string]string `json:"allocatable"`
}

type Pod struct {
	Name      string    `json:"name"`
	Namespace string    `json:"namespace"`
	Status    string    `json:"status"`
	Node      string    `json:"node"`
	Age       string    `json:"age"`
	Ready     string    `json:"ready"`
	Restarts  int32     `json:"restarts"`
	CreatedAt time.Time `json:"created_at"`
}

type ClusterMetrics struct {
	ClusterName string      `json:"cluster_name"`
	Nodes       NodeMetrics `json:"nodes"`
	Pods        PodMetrics  `json:"pods"`
	CPU         CPUMetrics  `json:"cpu"`
	Memory      MemoryMetrics `json:"memory"`
}

type NodeMetrics struct {
	Total int `json:"total"`
	Ready int `json:"ready"`
}

type PodMetrics struct {
	Total   int `json:"total"`
	Running int `json:"running"`
	Pending int `json:"pending"`
	Failed  int `json:"failed"`
}

type CPUMetrics struct {
	TotalCores     string `json:"total_cores"`
	UsedCores      string `json:"used_cores"`
	UsagePercent   string `json:"usage_percent"`
}

type MemoryMetrics struct {
	TotalMemory    string `json:"total_memory"`
	UsedMemory     string `json:"used_memory"`
	UsagePercent   string `json:"usage_percent"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
