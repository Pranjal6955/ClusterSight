# 🌐 ClusterSight

> A web-based observability dashboard for managing and monitoring multiple Kubernetes clusters from a single unified interface.

![ClusterSight Banner](https://your-banner-image-link.com)

---

## 🚀 Project Overview

**ClusterSight** provides DevOps engineers, platform teams, and open-source contributors with a unified dashboard to:

- Monitor multiple Kubernetes clusters
- View resource utilization (nodes, pods, CPU, memory)
- Explore cluster and namespace-level details
- Detect performance and reliability issues early

Built with:

- 🧠 **Backend**: Go + Gin (Kubernetes client-go)
- 🎨 **Frontend**: React + TypeScript + Tailwind CSS + Vite
- 📡 **API**: RESTful services
- 🐳 **Deployment**: Docker + Kubernetes

---

## 🖼️ Features

- 📁 List and manage multiple clusters
- 📊 View node health, CPU/memory metrics
- 🧩 Visualize pods per namespace
- 🔍 Inspect cluster-level details
- ⚙️ Connect to clusters via `kubeconfig`
- 📌 Frontend + Backend integration with Axios
- 🔐 CORS-enabled for cross-origin access
- 📦 Modular structure for easy extensibility

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React, TypeScript, Tailwind CSS, Vite |
| Backend      | Go, Gin, Kubernetes client-go     |
| API Comm     | REST, Axios                       |
| Deployment   | Docker, Kubernetes (Minikube/KIND)|
| State Mgmt   | React Hooks + Context API         |

---

## 📸 UI Screenshots

> (Add these once UI is built)
- Dashboard Overview
- Cluster Detail Page
- Node Metrics
- Pod Views

---

## 🔧 Getting Started

### 📦 Prerequisites

- Go (v1.20+)
- Node.js (v18+)
- Docker & Kubernetes (Minikube or KIND)
- Kubeconfig with access to one or more clusters

---

### 🚀 Backend Setup (Go + Gin)

```bash
git clone https://github.com/yourusername/clustersight.git
cd ClusterSight/Backend
go mod tidy
go run main.go
```

The backend will start on port 8080 (or find an available port automatically).

### 🎨 Frontend Setup (React + TypeScript + Vite)

```bash
cd ClusterSight/Frontend
npm install
npm run dev
```

The frontend will start on port 5173 and automatically connect to the backend.

### 🔗 Full Stack Development

1. **Start Backend:**
```bash
cd Backend
go run main.go
```

2. **Start Frontend (in new terminal):**
```bash
cd Frontend
npm run dev
```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api/v1

### 🐳 Docker Setup (Coming Soon)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

---

## 📡 API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/clusters` - List all clusters
- `GET /api/v1/clusters/:name/nodes` - Get cluster nodes
- `GET /api/v1/clusters/:name/pods` - Get cluster pods
- `GET /api/v1/clusters/:name/metrics` - Get cluster metrics

---

## 🏗️ Project Structure

```
ClusterSight/
├── Backend/
│   ├── main.go
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── routes/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## 🚨 Troubleshooting

### Backend Issues
- Ensure kubeconfig is properly configured: `kubectl cluster-info`
- Check if port 8080 is available
- Verify Kubernetes cluster connectivity

### Frontend Issues
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify npm dependencies are installed
- Frontend runs on port 5173 (Vite default)

### Connection Issues
- Backend and frontend must run on different ports
- CORS is pre-configured for development ports (5173, 3000, etc.)
- Check network connectivity between services

---

## 🔮 Roadmap

- [ ] Real-time metrics with WebSockets
- [ ] Multi-cluster comparison view
- [ ] Custom dashboards and alerts
- [ ] Helm charts for deployment
- [ ] Authentication and RBAC
- [ ] Dark mode support
- [ ] Export and reporting features

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.
