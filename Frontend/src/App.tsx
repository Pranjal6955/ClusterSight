
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClusterDetails from './pages/ClusterDetails';

function App() {


  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex h-[calc(100vh-73px)]">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cluster/:id" element={<ClusterDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
