import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Playlist from './pages/Playlist';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-blue-600">
                    Micro-URL Playlist Sharer
                  </Link>
                </div>
                <div className="ml-6 flex space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playlist/:playlistCode" element={<Playlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
