import { Cluster, Pod, Namespace, Event, ClusterMetrics, ApiError } from '../types';
import { 
  mockClusters, 
  generateMockPods, 
  generateMockNamespaces, 
  generateMockEvents, 
  generateMockClusterMetrics 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchClusters = async (): Promise<Cluster[]> => {
  try {
    await delay(800);
    return [...mockClusters];
  } catch (error) {
    console.error('Error fetching clusters:', error);
    throw error;
  }
};

export const fetchClusterById = async (id: string): Promise<Cluster> => {
  try {
    await delay(600);
    const cluster = mockClusters.find(c => c.id === id);
    if (!cluster) {
      throw {
        status: 404,
        message: `Cluster with ID ${id} not found`,
        code: 'CLUSTER_NOT_FOUND'
      } as ApiError;
    }
    return { ...cluster };
  } catch (error) {
    console.error(`Error fetching cluster ${id}:`, error);
    throw error;
  }
};

export const fetchClusterPods = async (clusterId: string): Promise<Pod[]> => {
  try {
    await delay(700);
    return generateMockPods(clusterId);
  } catch (error) {
    console.error(`Error fetching pods for cluster ${clusterId}:`, error);
    throw error;
  }
};

export const fetchClusterNamespaces = async (clusterId: string): Promise<Namespace[]> => {
  try {
    await delay(500);
    return generateMockNamespaces(clusterId);
  } catch (error) {
    console.error(`Error fetching namespaces for cluster ${clusterId}:`, error);
    throw error;
  }
};

export const fetchClusterEvents = async (clusterId: string): Promise<Event[]> => {
  try {
    await delay(900);
    return generateMockEvents(clusterId);
  } catch (error) {
    console.error(`Error fetching events for cluster ${clusterId}:`, error);
    throw error;
  }
};

export const fetchClusterMetrics = async (clusterId: string): Promise<ClusterMetrics> => {
  try {
    await delay(600);
    return generateMockClusterMetrics(clusterId);
  } catch (error) {
    console.error(`Error fetching metrics for cluster ${clusterId}:`, error);
    throw error;
  }
};