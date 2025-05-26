import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit = '',
  change,
  changeLabel = 'from last period',
  icon,
  className = '',
}) => {
  const renderChangeIndicator = () => {
    if (change === undefined) return null;
    
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-green-400">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {Math.abs(change).toFixed(1)}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="inline-flex items-center text-red-400">
          <ArrowDownRight className="h-3 w-3 mr-1" />
          {Math.abs(change).toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-gray-400">
          <Minus className="h-3 w-3 mr-1" />
          0%
        </span>
      );
    }
  };

  return (
    <div className={`bg-background-card rounded-lg shadow-sm p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {unit && <span className="ml-1 text-lg text-gray-300">{unit}</span>}
            </p>
          </div>
          {change !== undefined && (
            <p className="mt-1 text-xs text-gray-400">
              {renderChangeIndicator()} <span className="ml-1">{changeLabel}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-background-light rounded-md">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;