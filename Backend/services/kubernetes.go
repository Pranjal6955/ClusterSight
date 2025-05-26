package services

import (
	"context"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strings"
	"time"

	"clustersight/models"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

type KubernetesService struct {
	clients map[string]*kubernetes.Clientset
	port    string
}

func NewKubernetesService() *KubernetesService {
	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	return &KubernetesService{
		clients: make(map[string]*kubernetes.Clientset),
		port:    port,
	}
}

func (k *KubernetesService) GetPort() string {
	return k.port
}

func (k *KubernetesService) IsPortAvailable() error {
	ln, err := net.Listen("tcp", ":"+k.port)
	if err != nil {
		return fmt.Errorf("port %s is already in use", k.port)
	}
	ln.Close()
	return nil
}

func (k *KubernetesService) FindAvailablePort() string {
	for port := 8080; port <= 8090; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return fmt.Sprintf("%d", port)
		}
	}
	return "8080" // fallback
}

func (k *KubernetesService) InitializeClients() error {
	// Get kubeconfig path - check environment variable first
	kubeconfig := os.Getenv("KUBECONFIG")
	if kubeconfig == "" {
		if home := homedir.HomeDir(); home != "" {
			kubeconfig = filepath.Join(home, ".kube", "config")
		}
	}

	// Load kubeconfig
	config, err := clientcmd.LoadFromFile(kubeconfig)
	if err != nil {
		return fmt.Errorf("failed to load kubeconfig: %v", err)
	}

	// Create clients for each cluster context
	for contextName := range config.Contexts {
		clientConfig := clientcmd.NewNonInteractiveClientConfig(*config, contextName, &clientcmd.ConfigOverrides{}, nil)
		restConfig, err := clientConfig.ClientConfig()
		if err != nil {
			continue // Skip invalid contexts
		}

		clientset, err := kubernetes.NewForConfig(restConfig)
		if err != nil {
			continue // Skip invalid configs
		}

		k.clients[contextName] = clientset
	}

	return nil
}

func (k *KubernetesService) GetClusters() ([]models.Cluster, error) {
	var clusters []models.Cluster

	for clusterName, client := range k.clients {
		// Try to get cluster version
		version := "unknown"
		serverVersion, err := client.Discovery().ServerVersion()
		if err == nil {
			version = serverVersion.GitVersion
		}

		// Check cluster status by trying to list nodes
		status := "unknown"
		_, err = client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{Limit: 1})
		if err == nil {
			status = "connected"
		} else {
			status = "disconnected"
		}

		clusters = append(clusters, models.Cluster{
			Name:    clusterName,
			Status:  status,
			Version: version,
		})
	}

	return clusters, nil
}

func (k *KubernetesService) GetNodes(clusterName string) ([]models.Node, error) {
	client, exists := k.clients[clusterName]
	if !exists {
		return nil, fmt.Errorf("cluster %s not found", clusterName)
	}

	nodeList, err := client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get nodes: %v", err)
	}

	var nodes []models.Node
	for _, node := range nodeList.Items {
		// Extract node roles
		roles := extractNodeRoles(node)

		// Get node IPs
		internalIP, externalIP := extractNodeIPs(node)

		// Calculate age
		age := time.Since(node.CreationTimestamp.Time).Round(time.Hour).String()

		// Get node status
		status := "Unknown"
		for _, condition := range node.Status.Conditions {
			if condition.Type == corev1.NodeReady {
				if condition.Status == corev1.ConditionTrue {
					status = "Ready"
				} else {
					status = "NotReady"
				}
				break
			}
		}

		// Convert capacity and allocatable
		capacity := make(map[string]string)
		allocatable := make(map[string]string)
		
		for k, v := range node.Status.Capacity {
			capacity[string(k)] = v.String()
		}
		
		for k, v := range node.Status.Allocatable {
			allocatable[string(k)] = v.String()
		}

		nodes = append(nodes, models.Node{
			Name:        node.Name,
			Status:      status,
			Roles:       roles,
			Age:         age,
			Version:     node.Status.NodeInfo.KubeletVersion,
			InternalIP:  internalIP,
			ExternalIP:  externalIP,
			Capacity:    capacity,
			Allocatable: allocatable,
		})
	}

	return nodes, nil
}

func (k *KubernetesService) GetPods(clusterName string) ([]models.Pod, error) {
	client, exists := k.clients[clusterName]
	if !exists {
		return nil, fmt.Errorf("cluster %s not found", clusterName)
	}

	podList, err := client.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get pods: %v", err)
	}

	var pods []models.Pod
	for _, pod := range podList.Items {
		// Calculate restarts
		var restarts int32
		for _, containerStatus := range pod.Status.ContainerStatuses {
			restarts += containerStatus.RestartCount
		}

		// Calculate ready containers
		ready := fmt.Sprintf("%d/%d", 
			countReadyContainers(pod.Status.ContainerStatuses),
			len(pod.Spec.Containers))

		// Calculate age
		age := time.Since(pod.CreationTimestamp.Time).Round(time.Minute).String()

		pods = append(pods, models.Pod{
			Name:      pod.Name,
			Namespace: pod.Namespace,
			Status:    string(pod.Status.Phase),
			Node:      pod.Spec.NodeName,
			Age:       age,
			Ready:     ready,
			Restarts:  restarts,
			CreatedAt: pod.CreationTimestamp.Time,
		})
	}

	return pods, nil
}

func (k *KubernetesService) GetMetrics(clusterName string) (*models.ClusterMetrics, error) {
	client, exists := k.clients[clusterName]
	if !exists {
		return nil, fmt.Errorf("cluster %s not found", clusterName)
	}

	// Get nodes for metrics calculation
	nodeList, err := client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get nodes for metrics: %v", err)
	}

	// Get pods for metrics calculation
	podList, err := client.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get pods for metrics: %v", err)
	}

	// Calculate node metrics
	nodeMetrics := calculateNodeMetrics(nodeList.Items)
	
	// Calculate pod metrics
	podMetrics := calculatePodMetrics(podList.Items)
	
	// Calculate resource metrics (mock data for now)
	cpuMetrics := models.CPUMetrics{
		TotalCores:   "16",
		UsedCores:    "8.5",
		UsagePercent: "53.1",
	}
	
	memoryMetrics := models.MemoryMetrics{
		TotalMemory:  "64Gi",
		UsedMemory:   "28Gi",
		UsagePercent: "43.8",
	}

	return &models.ClusterMetrics{
		ClusterName: clusterName,
		Nodes:       nodeMetrics,
		Pods:        podMetrics,
		CPU:         cpuMetrics,
		Memory:      memoryMetrics,
	}, nil
}

// Helper functions
func extractNodeRoles(node corev1.Node) []string {
	var roles []string
	for label := range node.Labels {
		if strings.HasPrefix(label, "node-role.kubernetes.io/") {
			role := strings.TrimPrefix(label, "node-role.kubernetes.io/")
			if role == "" {
				role = "master"
			}
			roles = append(roles, role)
		}
	}
	if len(roles) == 0 {
		roles = append(roles, "worker")
	}
	return roles
}

func extractNodeIPs(node corev1.Node) (string, string) {
	var internalIP, externalIP string
	for _, addr := range node.Status.Addresses {
		switch addr.Type {
		case corev1.NodeInternalIP:
			internalIP = addr.Address
		case corev1.NodeExternalIP:
			externalIP = addr.Address
		}
	}
	return internalIP, externalIP
}

func countReadyContainers(statuses []corev1.ContainerStatus) int {
	count := 0
	for _, status := range statuses {
		if status.Ready {
			count++
		}
	}
	return count
}

func calculateNodeMetrics(nodes []corev1.Node) models.NodeMetrics {
	total := len(nodes)
	ready := 0
	
	for _, node := range nodes {
		for _, condition := range node.Status.Conditions {
			if condition.Type == corev1.NodeReady && condition.Status == corev1.ConditionTrue {
				ready++
				break
			}
		}
	}
	
	return models.NodeMetrics{
		Total: total,
		Ready: ready,
	}
}

func calculatePodMetrics(pods []corev1.Pod) models.PodMetrics {
	total := len(pods)
	running := 0
	pending := 0
	failed := 0
	
	for _, pod := range pods {
		switch pod.Status.Phase {
		case corev1.PodRunning:
			running++
		case corev1.PodPending:
			pending++
		case corev1.PodFailed:
			failed++
		}
	}
	
	return models.PodMetrics{
		Total:   total,
		Running: running,
		Pending: pending,
		Failed:  failed,
	}
}
