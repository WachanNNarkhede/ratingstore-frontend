import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { path: '/profile', label: 'Profile' },
    ];

    switch (user.role) {
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', label: 'Dashboard' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/stores', label: 'Stores' },
          ...commonLinks,
        ];
      case 'NORMAL_USER':
        return [
          { path: '/stores', label: 'Stores' },
          { path: '/my-ratings', label: 'My Ratings' },
          ...commonLinks,
        ];
      case 'STORE_OWNER':
        return [
          { path: '/my-store', label: 'My Store' },
          ...commonLinks,
        ];
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Store Rating System
              </Link>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                  <span className="text-sm text-gray-600">
                    {user.name} ({user.role.replace('_', ' ')})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;