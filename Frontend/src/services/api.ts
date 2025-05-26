import axios from 'axios';

// For Vite React setups - the types are now defined in vite-env.d.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Cluster {
  name: string;
  status: string;
  version: string;
}

export interface Node {
  name: string;
  status: string;
  roles: string[];
  age: string;
  version: string;
  internal_ip: string;
  external_ip: string;
  capacity: Record<string, string>;
  allocatable: Record<string, string>;
}

export interface Pod {
  name: string;
  namespace: string;
  status: string;
  node: string;
  age: string;
  ready: string;
  restarts: number;
  created_at: string;
}

export interface ClusterMetrics {
  cluster_name: string;
  nodes: {
    total: number;
    ready: number;
  };
  pods: {
    total: number;
    running: number;
    pending: number;
    failed: number;
  };
  cpu: {
    total_cores: string;
    used_cores: string;
    usage_percent: string;
  };
  memory: {
    total_memory: string;
    used_memory: string;
    usage_percent: string;
  };
}

export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Get all clusters
  async getClusters(): Promise<{ clusters: Cluster[]; count: number }> {
    const response = await api.get('/clusters');
    return response.data;
  },

  // Get nodes for a cluster
  async getNodes(clusterName: string): Promise<{ cluster: string; nodes: Node[]; count: number }> {
    const response = await api.get(`/clusters/${clusterName}/nodes`);
    return response.data;
  },

  // Get pods for a cluster
  async getPods(clusterName: string): Promise<{ cluster: string; pods: Pod[]; count: number }> {
    const response = await api.get(`/clusters/${clusterName}/pods`);
    return response.data;
  },

  // Get metrics for a cluster
  async getMetrics(clusterName: string): Promise<ClusterMetrics> {
    const response = await api.get(`/clusters/${clusterName}/metrics`);
    return response.data;
  },
};

export default api;
