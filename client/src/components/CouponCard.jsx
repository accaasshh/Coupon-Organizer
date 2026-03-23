import React from 'react'; // Don't forget to import React
import { FaCopy, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const CouponCard = ({ coupon, refreshCoupons }) => {
  // 1. Calculate Date Logic
  const expiryDate = new Date(coupon.expiryDate);
  const today = new Date();
  const timeDiff = expiryDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const isExpired = daysLeft < 0;
  const isExpiringSoon = daysLeft >= 0 && daysLeft <= 3;

  // 2. Dynamic Styling Logic
  let borderClass = 'border-green-500'; 
  if (isExpired) borderClass = 'border-red-500 opacity-60';
  else if (isExpiringSoon) borderClass = 'border-yellow-500';

  const formattedDate = expiryDate.toLocaleDateString('en-GB');

  // --- ACTIONS ---
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success('Code Copied!');
  };

  const handleRedirect = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success('Code Copied! Redirecting...');
    if (coupon.storeUrl) {
      setTimeout(() => window.open(coupon.storeUrl, '_blank'), 500);
    } else {
      toast.warning('No URL provided');
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/coupons/${coupon._id}`);
      toast.info('Coupon Deleted');
      refreshCoupons(); 
    } catch (err) {
      toast.error('Error deleting coupon');
    }
  };

  return (
    // FIX 1: Added 'h-full flex flex-col' to make card stretch and organize vertically
    <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 relative transition hover:-translate-y-1 h-full flex flex-col ${borderClass}`}>
      
      {/* Category Badge */}
      <span className="absolute top-3 right-3 text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
        {coupon.category}
      </span>

      {/* Expiring Badge */}
      <div className="min-h-[24px] mb-1"> 
        {isExpiringSoon && (
          <span className="inline-block text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full uppercase border border-yellow-200">
            Expiring Soon
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-800 leading-tight">{coupon.storeName}</h3>
      
      {/* FIX 2: Added 'min-h-[40px]' so cards with no description don't shrink */}
      <p className="text-gray-500 text-sm mb-2 min-h-[40px] line-clamp-2">
        {coupon.description || "No description provided"}
      </p>
      
      {/* Code Box */}
      <div className="bg-gray-50 p-3 rounded-md border border-dashed border-gray-300 flex justify-between items-center my-3">
        <span className="font-mono font-bold text-lg tracking-wider text-blue-600">{coupon.code}</span>
        <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600 p-2" title="Copy Code Only">
          <FaCopy />
        </button>
      </div>

      {/* FIX 3: Changed 'mt-4' to 'mt-auto' to push this footer to the absolute bottom */}
      <div className="flex justify-between items-end mt-auto pt-4">
        <div>
          <p className="text-xs text-gray-400">Expires On:</p>
          <p className={`text-sm font-semibold ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-700'}`}>
            {formattedDate} {isExpired && "(Expired)"}
          </p>
        </div>

        <div className="flex gap-2">
           <button onClick={handleDelete} className="text-red-400 hover:text-red-600 p-2" title="Delete">
            <FaTrash />
          </button>
          {coupon.storeUrl && (
            <button onClick={handleRedirect} className="text-blue-400 hover:text-blue-600 p-2" title="Copy & Go to Store">
              <FaExternalLinkAlt />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;