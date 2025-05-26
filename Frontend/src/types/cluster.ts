export interface Cluster {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  nodeCount: number;
  podCount: number;
  cpuUsage: number;
  memoryUsage: number;
  version: string;
  region: string;
}

export interface Pod {
  id: string;
  name: string;
  namespace: string;
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded';
  cpuUsage: number;
  memoryUsage: number;
  restarts: number;
}

export interface Namespace {
  name: string;
  podCount: number;
  status: 'Active' | 'Terminating';
}

export interface Event {
  id: string;
  type: 'Normal' | 'Warning' | 'Error';
  reason: string;
  message: string;
  timestamp: string;
  source: string;
}

export interface ClusterDetails {
  cluster: Cluster;
  pods: Pod[];
  namespaces: Namespace[];
  events: Event[];
}
