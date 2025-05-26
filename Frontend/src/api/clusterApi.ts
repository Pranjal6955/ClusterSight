import axios from 'axios';
import type { Cluster, ClusterDetails } from '../types/cluster';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const clusterApi = {
  getClusters: async (): Promise<Cluster[]> => {
    const response = await api.get('/clusters');
    return response.data;
  },

  getClusterDetails: async (clusterId: string): Promise<ClusterDetails> => {
    const response = await api.get(`/clusters/${clusterId}`);
    return response.data;
  },

  getClusterMetrics: async (clusterId: string) => {
    const response = await api.get(`/clusters/${clusterId}/metrics`);
    return response.data;
  }
};
