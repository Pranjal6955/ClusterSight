export interface Cluster {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  version: string;
  nodes: number;
  region: string;
  provider: 'aws' | 'gcp' | 'azure' | 'other';
  lastUpdated: string;
  cpu: ResourceMetric;
  memory: ResourceMetric;
  storage: ResourceMetric;
}

export interface ResourceMetric {
  usage: number;
  capacity: number;
  history: TimeSeriesPoint[];
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface Pod {
  id: string;
  name: string;
  namespace: string;
  status: 'running' | 'pending' | 'failed' | 'succeeded' | 'unknown';
  restarts: number;
  age: string;
  cpu: string;
  memory: string;
  createdAt: string;
}

export interface Namespace {
  id: string;
  name: string;
  status: 'active' | 'terminating';
  pods: number;
  age: string;
  cpu: string;
  memory: string;
}

export interface Event {
  id: string;
  type: 'normal' | 'warning' | 'error';
  reason: string;
  object: string;
  message: string;
  timestamp: string;
}

export interface ClusterMetrics {
  cpu: {
    usage: number;
    limit: number;
    history: TimeSeriesPoint[];
  };
  memory: {
    usage: number;
    limit: number;
    history: TimeSeriesPoint[];
  };
  pods: {
    running: number;
    pending: number;
    failed: number;
    succeeded: number;
    total: number;
  };
  nodes: {
    ready: number;
    notReady: number;
    total: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}