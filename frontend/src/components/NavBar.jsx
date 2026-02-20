import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from './providers/AuthProvider.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Zap size={22} />
            <span>Anvaya.Ai</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                <button onClick={() => logout()} className="ml-2 px-3 py-1 rounded border border-gray-200 text-sm text-gray-700 hover:shadow-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="ml-2 inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
