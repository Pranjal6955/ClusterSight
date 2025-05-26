import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../../types';

interface EventStreamProps {
  events: Event[];
  autoScroll?: boolean;
}

const EventStream: React.FC<EventStreamProps> = ({ events, autoScroll = true }) => {
  const [filter, setFilter] = useState<'all' | 'normal' | 'warning' | 'error'>('all');
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (autoScroll && streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [events, autoScroll]);

  // Filter events
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'normal':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-background-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-white">Event Stream</h3>
        
        <div className="flex space-x-1 bg-background-light rounded-md overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              filter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              filter === 'normal' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter('normal')}
          >
            Normal
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              filter === 'warning' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter('warning')}
          >
            Warning
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              filter === 'error' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter('error')}
          >
            Error
          </button>
        </div>
      </div>
      
      <div 
        ref={streamRef}
        className="h-[400px] overflow-y-auto font-mono text-sm p-4 bg-background"
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="mb-2 border-b border-gray-800 pb-2 last:border-0">
              <div className="flex items-start">
                <span className="text-gray-500 mr-2">
                  {formatTimestamp(event.timestamp)}
                </span>
                <span className={`font-medium ${getEventTypeClass(event.type)} mr-2`}>
                  {event.type.toUpperCase()}
                </span>
                <span className="text-gray-300">{event.reason}</span>
              </div>
              <div className="mt-1 ml-14">
                <span className="text-gray-400">{event.object}:</span>
                <span className="text-white ml-2">{event.message}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No events found matching your filter
          </div>
        )}
      </div>
    </div>
  );
};

export default EventStream;