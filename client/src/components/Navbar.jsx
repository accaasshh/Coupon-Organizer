import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <FaTicketAlt /> CouponOrganizer
        </Link>

        {/* Links */}
        <div className="flex gap-4 items-center">
          {token ? (
            <>
              <Link to="/" className="hover:text-blue-200">Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1 hover:text-red-200 bg-blue-700 px-3 py-1 rounded transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-bold hover:bg-gray-100 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;