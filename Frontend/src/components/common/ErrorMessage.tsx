import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiError } from '../../types';

interface ErrorMessageProps {
  error: ApiError | Error | unknown;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, retry }) => {
  // Extract message from different error types
  const getMessage = () => {
    if (typeof error === 'string') {
      return error;
    } else if (error instanceof Error) {
      return error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'An unexpected error occurred';
  };

  // Determine if it's a network error
  const isNetworkError = () => {
    if (error instanceof Error) {
      return error.message.includes('network') || error.message.includes('fetch');
    }
    return false;
  };

  // Get appropriate error status
  const getStatus = () => {
    if (error && typeof error === 'object' && 'status' in error) {
      return (error as ApiError).status;
    }
    return isNetworkError() ? 'Network Error' : 'Error';
  };

  return (
    <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 my-4 text-white">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-300">
            {getStatus()} {getStatus() === 'Network Error' ? '' : '•'} {getMessage()}
          </h3>
          <div className="mt-2 text-sm text-gray-300">
            <p>
              {isNetworkError() 
                ? 'Unable to connect to the server. Please check your internet connection.'
                : 'There was an error processing your request. Please try again later.'}
            </p>
          </div>
          {retry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;