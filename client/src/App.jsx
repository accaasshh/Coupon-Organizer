import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from 'react'; // Add this line
import axios from 'axios'; // Add this
import CouponCard from './components/CouponCard'; // Add this
import AddCouponForm from './components/AddCouponForm'; // Add this
import AuthContext from './context/AuthContext'; // Add this
import StatsChart from './components/StatsChart';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

// ... keep your imports (useState, useEffect, axios, etc.)

const Dashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/coupons');
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter Logic
  const filteredCoupons = coupons
  .filter(coupon => {
    const matchesCategory = filter === 'All' || coupon.category === filter;
    const matchesSearch = coupon.storeName.toLowerCase().includes(search.toLowerCase()) || 
                          coupon.code.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
    } else if (sortBy === 'expiry') {
      return new Date(a.expiryDate) - new Date(b.expiryDate); // Sooner expiry first
    }
    return 0;
  });
  const categories = ['All', 'Fashion', 'Food', 'Tech', 'Travel', 'Other'];

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Coupons</h1>
        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
          Total: {coupons.length}
        </span>
      </div>
      
      {/* 1. Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
  {/* Left Side: Form (Takes up 2/3 space) */}
  <div className="lg:col-span-2">
    <AddCouponForm refreshCoupons={fetchCoupons} />
  </div>

  {/* Right Side: Charts (Takes up 1/3 space) */}
  <div className="lg:col-span-1">
    <StatsChart coupons={coupons} />
  </div>
</div>

      {/* 2. Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Group (Grouped together now) */}
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search stores..." 
            className="border p-2 rounded-lg w-full md:w-64 focus:outline-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select 
            className="border p-2 rounded-lg focus:outline-blue-500 bg-white cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="expiry">Expiring</option>
          </select>
        </div>
      </div>


      {/* 3. The Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No coupons found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon._id} coupon={coupon} refreshCoupons={fetchCoupons} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <ToastContainer position="top-center" autoClose={2000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;