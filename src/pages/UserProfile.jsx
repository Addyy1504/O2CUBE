import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const { user, token, login, logout, isAdmin } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/orders?user_id=${user.id}`);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    // Remove auth token and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-semibold">
            Welcome, {user.name || user.email}
          </h2>
          <p className="text-gray-600">📩 Check your email for order tracking updates.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-2xl font-medium mb-3">Your Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded shadow-sm bg-white">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="text-sm text-gray-600">🧾 Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600">Placed on: {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  {order.status && (
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold
                      ${order.status === 'delivered' ? 'bg-green-600 text-white' :
                        order.status === 'shipped' ? 'bg-blue-500 text-white' :
                        order.status === 'accepted' ? 'bg-yellow-500 text-white' :
                        'bg-gray-400 text-white'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium mt-2">Items:</p>
                <ul className="ml-4 list-disc text-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} × {item.quantity} ({item.size})
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

                <div className="flex justify-between mt-2 text-sm font-semibold">
                  <span>Total: ₹{order.total_amount}</span>
                  <span>Payment: {order.customer_info?.payment?.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
