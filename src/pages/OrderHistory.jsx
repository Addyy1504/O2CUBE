import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const { user, token, login, logout, isAdmin } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) fetchOrders();
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://o2cube-production.up.railway.app/api/orders?user_id=${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">📦 Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-block px-4 py-1 text-xs rounded-full font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-green-600 text-white'
                        : order.status === 'shipped'
                        ? 'bg-blue-500 text-white'
                        : order.status === 'accepted'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}
                  >
                    {order.status
                      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                      : 'Pending'}
                  </span>
                </div>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {order.items.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item.title} x {item.quantity} ({item.size})
                    {item.isCustom && item.image && (
                      <div className="mt-1">
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs"
                        >
                          View Uploaded Image
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4 text-sm font-semibold">
                <span>Total Amount:</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
