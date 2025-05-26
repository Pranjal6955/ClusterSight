# MetricsFlow 📊

> Real-time Docker container and system metrics monitoring dashboard

MetricsFlow is a modern, real-time monitoring solution that provides comprehensive insights into your Docker containers and system performance. Built with Go, React, and Prometheus, it offers a sleek dashboard for visualizing CPU, memory, and container metrics.

## ✨ Features

- **Real-time Metrics**: Live monitoring of CPU and memory usage
- **Container Monitoring**: Track individual Docker container performance
- **Interactive Dashboard**: Modern React-based UI with responsive charts
- **Docker Integration**: Seamless container discovery and metrics collection
- **Prometheus Backend**: Reliable metrics storage and querying
- **Docker Compose**: One-command deployment
- **CORS Support**: Frontend-backend communication ready
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Prometheus    │
│   (React)       │◄───┤   (Go/Gin)     │◄───┤   (Metrics)     │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 9090    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       ▲
                                │                       │
                                ▼                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Docker Engine   │    │    cAdvisor     │
                       │ (Containers)    │────┤  (Container     │
                       │                 │    │   Metrics)      │
                       └─────────────────┘    │   Port: 8082    │
                                              └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Go 1.23+ (for local development)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/metricsflow.git
   cd metricsflow
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - **Dashboard**: http://localhost:3000
   - **API**: http://localhost:8081
   - **Prometheus**: http://localhost:9090
   - **cAdvisor**: http://localhost:8082

### Option 2: Local Development

1. **Start Backend**
   ```bash
   cd Backend
   go mod download
   go run main.go
   ```

2. **Start Frontend**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Start Monitoring Stack**
   ```bash
   docker-compose up prometheus cadvisor -d
   ```

## 📋 Services Overview

| Service | Description | Port | Health Check |
|---------|-------------|------|--------------|
| **Frontend** | React dashboard | 3000 | http://localhost:3000 |
| **Backend** | Go API server | 8081 | http://localhost:8081/health |
| **Prometheus** | Metrics database | 9090 | http://localhost:9090/-/healthy |
| **cAdvisor** | Container metrics | 8082 | http://localhost:8082/healthz |

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PROMETHEUS_URL=http://prometheus:9090
SERVER_PORT=8081
DOCKER_HOST=unix:///var/run/docker.sock
CORS_ORIGINS=http://localhost:3000,http://frontend:3000
```

#### Frontend (.env.docker)
```env
VITE_API_BASE_URL=http://backend:8081
VITE_API_URL=http://backend:8081/api
```

### Prometheus Configuration

The Prometheus configuration (`prometheus/prometheus.yml`) includes:
- Self-monitoring
- cAdvisor container metrics
- Backend API metrics
- Custom scrape intervals

## 📊 API Endpoints

### Health Check
```http
GET /health
```

### Metrics
```http
GET /api/metrics
```
Returns current system CPU and memory usage.

### Container Information
```http
GET /api/containers
```
Returns list of all Docker containers with status.

### Container Metrics
```http
GET /api/containers/{id}/metrics
```
Returns metrics for a specific container.

## 🎨 Dashboard Features

- **Real-time Charts**: CPU and memory usage over time
- **Metrics Cards**: Current and average resource usage
- **Auto-refresh**: Updates every 3 seconds
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Graceful error states and loading indicators
- **Dark Theme**: Modern dark UI design

## 🛠️ Development

### Frontend Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Lucide React** for icons

### Backend Tech Stack
- **Go 1.23** with Gin framework
- **Prometheus Client** for metrics
- **Docker SDK** for container interaction
- **CORS** middleware for cross-origin requests

### Project Structure
```
MetricsFlow/
├── Frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx          # Main application
│   ├── package.json
│   └── vite.config.ts
├── Backend/                  # Go API server
│   ├── internal/
│   │   ├── handlers/        # HTTP handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── config/          # Configuration
│   ├── main.go
│   └── go.mod
├── prometheus/               # Prometheus configuration
│   └── prometheus.yml
├── docker-compose.yml        # Multi-service setup
├── Dockerfile.frontend       # Frontend container
└── Dockerfile.backend        # Backend container
```

## 🔍 Monitoring Metrics

### System Metrics
- **CPU Usage**: Real-time processor utilization
- **Memory Usage**: RAM consumption and availability
- **Historical Data**: Up to 20 recent data points

### Container Metrics (via cAdvisor)
- Container CPU usage rate
- Memory usage and limits
- Network I/O statistics
- Container status and health

## 🐳 Docker Commands

### Build and Run
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Individual Services
```bash
# Start only monitoring stack
docker-compose up prometheus cadvisor -d

# Start only application
docker-compose up frontend backend -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000, 8081, 8082, 9090 are available
   - Modify port mappings in docker-compose.yml if needed

2. **Backend Connection Issues**
   - Check if Docker daemon is running
   - Verify Docker socket permissions: `/var/run/docker.sock`

3. **Frontend API Errors**
   - Ensure backend is running on port 8081
   - Check CORS configuration in backend

4. **No Metrics Data**
   - Verify Prometheus is scraping cAdvisor
   - Check Prometheus targets: http://localhost:9090/targets

### Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs prometheus
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Prometheus](https://prometheus.io/) for metrics collection
- [cAdvisor](https://github.com/google/cadvisor) for container metrics
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Gin](https://gin-gonic.com/) for Go web framework
- [Docker](https://www.docker.com/) for containerization

## 📞 Support

For support and questions:
- Create an [Issue](https://github.com/your-username/metricsflow/issues)
- Check [Documentation](https://github.com/your-username/metricsflow/wiki)
- Join our [Discussions](https://github.com/your-username/metricsflow/discussions)

---

**MetricsFlow** - Making container monitoring simple and beautiful! 🚀
