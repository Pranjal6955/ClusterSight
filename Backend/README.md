# ClusterSight - Kubernetes Observability Dashboard API

ClusterSight is a REST API built with Go and Gin framework that provides Kubernetes observability capabilities. It connects to one or more Kubernetes clusters and exposes endpoints to retrieve cluster information, nodes, pods, and metrics.

## Features

- 🔍 **Multi-cluster support** - Connect to multiple Kubernetes clusters
- 📊 **Comprehensive data** - Nodes, pods, and cluster metrics
- 🚀 **Fast API** - Built with Gin for high performance
- 🔒 **Secure** - Uses kubeconfig for authentication
- 🌐 **CORS enabled** - Ready for frontend integration
- 📝 **Well documented** - Complete API documentation

## Prerequisites

- Go 1.21 or higher
- Access to Kubernetes cluster(s)
- kubectl configured with valid kubeconfig
- Kubernetes cluster(s) accessible from your development environment

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd NarratiX/Backend
```

2. **Initialize Go modules:**
```bash
go mod init clustersight
go mod tidy
```

3. **Install dependencies:**
```bash
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
go get k8s.io/client-go@v0.28.4
go get k8s.io/api@v0.28.4
go get k8s.io/apimachinery@v0.28.4
go get k8s.io/metrics@v0.28.4
```

## Configuration

### Kubeconfig Setup

The API reads from your local kubeconfig file located at `~/.kube/config`. Make sure you have:

1. **Valid kubeconfig:** Test with `kubectl cluster-info`
2. **Multiple contexts (optional):** For multi-cluster support
3. **Proper permissions:** Read access to nodes and pods

### Environment Variables

Currently, the API uses default kubeconfig. Future versions will support:
- `KUBECONFIG` - Custom kubeconfig path
- `PORT` - Custom port (default: 8080)

## Running the Application

### Development Mode

```bash
go run main.go
```

### Production Build

```bash
go build -o clustersight main.go
./clustersight
```

### Using Air for Hot Reload (Development)

```bash
# Install Air
go install github.com/cosmtrek/air@latest

# Run with hot reload
air
```

## API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "ClusterSight API",
  "version": "1.0.0"
}
```

### Get All Clusters
```http
GET /clusters
```
**Response:**
```json
{
  "clusters": [
    {
      "name": "minikube",
      "status": "connected",
      "version": "v1.28.3"
    }
  ],
  "count": 1
}
```

### Get Cluster Nodes
```http
GET /clusters/:name/nodes
```
**Response:**
```json
{
  "cluster": "minikube",
  "nodes": [
    {
      "name": "minikube",
      "status": "Ready",
      "roles": ["control-plane"],
      "age": "5h30m",
      "version": "v1.28.3",
      "internal_ip": "192.168.49.2",
      "external_ip": "",
      "capacity": {
        "cpu": "4",
        "memory": "8Gi"
      },
      "allocatable": {
        "cpu": "4",
        "memory": "7.5Gi"
      }
    }
  ],
  "count": 1
}
```

### Get Cluster Pods
```http
GET /clusters/:name/pods
```
**Response:**
```json
{
  "cluster": "minikube",
  "pods": [
    {
      "name": "coredns-5dd5756b68-xyz",
      "namespace": "kube-system",
      "status": "Running",
      "node": "minikube",
      "age": "5h30m",
      "ready": "1/1",
      "restarts": 0,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 15
}
```

### Get Cluster Metrics
```http
GET /clusters/:name/metrics
```
**Response:**
```json
{
  "cluster_name": "minikube",
  "nodes": {
    "total": 1,
    "ready": 1
  },
  "pods": {
    "total": 15,
    "running": 14,
    "pending": 1,
    "failed": 0
  },
  "cpu": {
    "total_cores": "4",
    "used_cores": "1.2",
    "usage_percent": "30.0"
  },
  "memory": {
    "total_memory": "8Gi",
    "used_memory": "3.2Gi",
    "usage_percent": "40.0"
  }
}
```

## Project Structure

```
.
├── main.go                 # Application entry point
├── go.mod                  # Go module definition
├── models/
│   └── models.go          # Data structures
├── services/
│   └── kubernetes.go      # Kubernetes client logic
├── controllers/
│   └── cluster_controller.go # HTTP handlers
├── routes/
│   └── routes.go          # Route definitions
└── README.md              # This file
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Failed to get clusters",
  "message": "connection refused"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing parameters)
- `500` - Internal Server Error (cluster connection issues)

## Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8080/api/v1/health

# Get clusters
curl http://localhost:8080/api/v1/clusters

# Get nodes (replace 'minikube' with your cluster name)
curl http://localhost:8080/api/v1/clusters/minikube/nodes

# Get pods
curl http://localhost:8080/api/v1/clusters/minikube/pods

# Get metrics
curl http://localhost:8080/api/v1/clusters/minikube/metrics
```

### Using httpie

```bash
# Install httpie
pip install httpie

# Test endpoints
http GET localhost:8080/api/v1/clusters
http GET localhost:8080/api/v1/clusters/minikube/nodes
```

## Troubleshooting

### Common Issues

1. **"Failed to load kubeconfig"**
   - Ensure `~/.kube/config` exists and is valid
   - Test with `kubectl cluster-info`

2. **"Cluster not found"**
   - Check available contexts: `kubectl config get-contexts`
   - Use the exact context name in the API

3. **"Connection refused"**
   - Verify cluster is running and accessible
   - Check network connectivity to cluster

4. **"Permission denied"**
   - Ensure your kubeconfig has proper RBAC permissions
   - Test with `kubectl get nodes` and `kubectl get pods --all-namespaces`

### Debug Mode

Enable Gin debug mode by setting:
```bash
export GIN_MODE=debug
go run main.go
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Real-time metrics using Prometheus
- [ ] WebSocket support for live updates
- [ ] Authentication and authorization
- [ ] Custom resource definitions (CRDs) support
- [ ] Helm chart for easy deployment
- [ ] Docker container support
- [ ] Unit and integration tests
