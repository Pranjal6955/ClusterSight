import React from 'react';
import Dashboard from './components/Dashboard';
import { GithubIcon } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L3 14h7l-1 8 7-12h-7l1-8z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MetricsFlow</h1>
              <p className="text-gray-400 text-sm">Real-time container monitoring</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <GithubIcon className="h-5 w-5 mr-1" />
            <span className="hidden md:inline">View on GitHub</span>
          </a>
        </header>

        <main>
          <Dashboard />
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 MetricsFlow. All rights reserved.</p>
          <p className="mt-1">Connected to backend at localhost:8081</p>
        </footer>
      </div>
    </div>
  );
}

export default App;