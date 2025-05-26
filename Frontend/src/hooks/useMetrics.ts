import { useState, useEffect } from 'react';
import { MetricsData } from '../types/metrics';

const MAX_DATA_POINTS = 20;

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const useMetrics = (refreshInterval = 3000) => {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Use full URL for better Docker compatibility
        const response = await fetch(`${API_BASE_URL}/api/metrics`);
        
        if (!response.ok) {
          throw new Error(`Error fetching metrics: ${response.status}`);
        }
        
        const data = await response.json();
        setMetricsData(prevData => {
          const newData = [...prevData, {
            timestamp: Date.now(),
            cpu: data.cpu || 0,
            memory: data.memory || 0
          }];
          
          // Keep only the last MAX_DATA_POINTS data points
          return newData.slice(-MAX_DATA_POINTS);
        });
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchMetrics();
    
    // Set up interval for refreshing
    const intervalId = setInterval(fetchMetrics, refreshInterval);
    
    // Clean up
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { metricsData, isLoading, error };
};