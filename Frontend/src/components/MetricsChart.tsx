import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { MetricsData } from '../types/metrics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricsChartProps {
  data: MetricsData[];
  title: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data, title }) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const chartData = {
    labels: data.map(d => formatTime(d.timestamp)),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: data.map(d => d.cpu),
        borderColor: 'rgba(59, 130, 246, 1)', // blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Memory Usage (%)',
        data: data.map(d => d.memory),
        borderColor: 'rgba(16, 185, 129, 1)', // green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        }
      },
      x: {
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(156, 163, 175, 1)',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: title,
        color: 'rgba(156, 163, 175, 1)',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgba(229, 231, 235, 1)',
        bodyColor: 'rgba(229, 231, 235, 1)',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        intersect: false,
        mode: 'index',
      },
    },
  };

  return (
    <div className="h-[350px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MetricsChart;