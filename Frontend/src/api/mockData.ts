import { Cluster, Pod, Namespace, Event, ClusterMetrics } from '../types';

const generateTimeSeriesData = (
  points: number,
  min: number,
  max: number
): { timestamp: string; value: number }[] => {
  const now = new Date();
  return Array.from({ length: points }).map((_, i) => {
    const date = new Date(now.getTime() - (points - i) * 300000); // 5 minutes intervals
    return {
      timestamp: date.toISOString(),
      value: min + Math.random() * (max - min),
    };
  });
};

export const mockClusters: Cluster[] = [
  {
    id: 'cluster-1',
    name: 'Production US-East',
    status: 'healthy',
    version: 'v1.27.3',
    nodes: 12,
    region: 'us-east-1',
    provider: 'aws',
    lastUpdated: new Date().toISOString(),
    cpu: {
      usage: 62,
      capacity: 100,
      history: generateTimeSeriesData(24, 40, 75),
    },
    memory: {
      usage: 48,
      capacity: 100,
      history: generateTimeSeriesData(24, 30, 60),
    },
    storage: {
      usage: 35,
      capacity: 100,
      history: generateTimeSeriesData(24, 20, 50),
    },
  },
  {
    id: 'cluster-2',
    name: 'Staging EU',
    status: 'warning',
    version: 'v1.26.8',
    nodes: 6,
    region: 'eu-central-1',
    provider: 'aws',
    lastUpdated: new Date().toISOString(),
    cpu: {
      usage: 78,
      capacity: 100,
      history: generateTimeSeriesData(24, 60, 85),
    },
    memory: {
      usage: 66,
      capacity: 100,
      history: generateTimeSeriesData(24, 50, 80),
    },
    storage: {
      usage: 42,
      capacity: 100,
      history: generateTimeSeriesData(24, 30, 55),
    },
  },
  {
    id: 'cluster-3',
    name: 'Development APAC',
    status: 'critical',
    version: 'v1.25.12',
    nodes: 3,
    region: 'ap-southeast-1',
    provider: 'gcp',
    lastUpdated: new Date().toISOString(),
    cpu: {
      usage: 92,
      capacity: 100,
      history: generateTimeSeriesData(24, 85, 98),
    },
    memory: {
      usage: 87,
      capacity: 100,
      history: generateTimeSeriesData(24, 80, 95),
    },
    storage: {
      usage: 76,
      capacity: 100,
      history: generateTimeSeriesData(24, 65, 85),
    },
  },
  {
    id: 'cluster-4',
    name: 'Data Processing',
    status: 'healthy',
    version: 'v1.27.1',
    nodes: 8,
    region: 'us-west-2',
    provider: 'azure',
    lastUpdated: new Date().toISOString(),
    cpu: {
      usage: 45,
      capacity: 100,
      history: generateTimeSeriesData(24, 30, 60),
    },
    memory: {
      usage: 52,
      capacity: 100,
      history: generateTimeSeriesData(24, 40, 65),
    },
    storage: {
      usage: 38,
      capacity: 100,
      history: generateTimeSeriesData(24, 25, 50),
    },
  },
  {
    id: 'cluster-5',
    name: 'Analytics Platform',
    status: 'warning',
    version: 'v1.26.5',
    nodes: 5,
    region: 'eu-west-1',
    provider: 'aws',
    lastUpdated: new Date().toISOString(),
    cpu: {
      usage: 75,
      capacity: 100,
      history: generateTimeSeriesData(24, 65, 85),
    },
    memory: {
      usage: 82,
      capacity: 100,
      history: generateTimeSeriesData(24, 70, 90),
    },
    storage: {
      usage: 58,
      capacity: 100,
      history: generateTimeSeriesData(24, 45, 70),
    },
  },
];

export const generateMockPods = (clusterId: string): Pod[] => {
  const statuses = ['running', 'pending', 'failed', 'succeeded', 'unknown'] as const;
  const namespaces = ['default', 'kube-system', 'monitoring', 'logging', 'app'];
  
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${clusterId}-pod-${i}`,
    name: `pod-${i}-${Math.random().toString(36).substring(7)}`,
    namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
    status: statuses[Math.floor(Math.random() * 5)],
    restarts: Math.floor(Math.random() * 5),
    age: `${Math.floor(Math.random() * 30) + 1}d`,
    cpu: `${Math.floor(Math.random() * 200)}m`,
    memory: `${Math.floor(Math.random() * 512)}Mi`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
  }));
};

export const generateMockNamespaces = (clusterId: string): Namespace[] => {
  const statuses = ['active', 'terminating'] as const;
  const namespaceNames = [
    'default', 'kube-system', 'kube-public', 'kube-node-lease',
    'monitoring', 'logging', 'app', 'ingress-nginx', 'cert-manager'
  ];
  
  return namespaceNames.map((name, i) => ({
    id: `${clusterId}-ns-${i}`,
    name,
    status: Math.random() > 0.2 ? 'active' : 'terminating',
    pods: Math.floor(Math.random() * 20) + 1,
    age: `${Math.floor(Math.random() * 60) + 1}d`,
    cpu: `${Math.floor(Math.random() * 1000)}m`,
    memory: `${Math.floor(Math.random() * 2048)}Mi`,
  }));
};

export const generateMockEvents = (clusterId: string): Event[] => {
  const types = ['normal', 'warning', 'error'] as const;
  const reasons = [
    'Created', 'Started', 'Pulled', 'Killing', 'BackOff', 'Failed',
    'Unhealthy', 'NodeNotReady', 'FailedMount', 'FailedScheduling'
  ];
  const objects = [
    'Pod/nginx-76d6c9b8c-xkgb2',
    'Deployment/webapp',
    'StatefulSet/redis',
    'Node/worker-1',
    'Service/api',
    'Ingress/frontend'
  ];
  
  return Array.from({ length: 30 }).map((_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    
    return {
      id: `${clusterId}-event-${i}`,
      type,
      reason,
      object,
      message: `${reason}: ${object.split('/')[1]} ${type === 'normal' ? 'successfully' : 'failed to'} ${reason.toLowerCase()}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 60) * 60000).toISOString(),
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockClusterMetrics = (clusterId: string): ClusterMetrics => {
  return {
    cpu: {
      usage: Math.floor(Math.random() * 85) + 15,
      limit: 100,
      history: generateTimeSeriesData(72, 20, 90),
    },
    memory: {
      usage: Math.floor(Math.random() * 85) + 15,
      limit: 100,
      history: generateTimeSeriesData(72, 30, 95),
    },
    pods: {
      running: Math.floor(Math.random() * 50) + 20,
      pending: Math.floor(Math.random() * 5),
      failed: Math.floor(Math.random() * 3),
      succeeded: Math.floor(Math.random() * 10),
      total: Math.floor(Math.random() * 70) + 30,
    },
    nodes: {
      ready: Math.floor(Math.random() * 10) + 3,
      notReady: Math.floor(Math.random() * 2),
      total: Math.floor(Math.random() * 12) + 3,
    },
  };
};