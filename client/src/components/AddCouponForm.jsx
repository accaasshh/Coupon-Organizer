import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCouponForm = ({ refreshCoupons }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    code: '',
    category: 'Fashion',
    expiryDate: '',
    storeUrl: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/coupons', formData);
      toast.success('Coupon Added!');
      setFormData({ // Reset form
        storeName: '', code: '', category: 'Fashion', expiryDate: '', storeUrl: '', description: ''
      });
      refreshCoupons(); // Refresh the grid
    } catch (err) {
      toast.error('Error adding coupon');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-blue-100">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Add New Coupon</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <input required type="text" placeholder="Store Name (e.g. Amazon)" className="p-2 border rounded"
          value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
          
        <input required type="text" placeholder="Coupon Code (e.g. SAVE20)" className="p-2 border rounded"
          value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />

        <select className="p-2 border rounded"
          value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
          <option>Fashion</option>
          <option>Food</option>
          <option>Tech</option>
          <option>Travel</option>
          <option>Other</option>
        </select>

        <input required type="date" className="p-2 border rounded"
          value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />

        <input type="url" placeholder="Store URL (https://...)" className="p-2 border rounded"
          value={formData.storeUrl} onChange={e => setFormData({...formData, storeUrl: e.target.value})} />

        <input type="text" placeholder="Description (20% Off Shoes)" className="p-2 border rounded"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

        <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
          + Save Coupon
        </button>
      </form>
    </div>
  );
};

export default AddCouponForm;