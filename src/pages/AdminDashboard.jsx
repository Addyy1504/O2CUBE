import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, mostSold: {} });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const isMasterAdmin = user?.email === 'o2cube02@gmail.com';

  useEffect(() => {
  if (user === null) return; // Wait for user to load

  if (!isMasterAdmin) {
    navigate('/');
    return;
  }

  fetchOrders();
}, [user]);


  const fetchOrders = async () => {
    try {
      const res = await fetch('https://o2cube-production.up.railway.app/api/orders');
      const data = await res.json();
      setOrders(data);
      computeStats(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://o2cube-production.up.railway.app/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const computeStats = (data) => {
    let total = 0;
    let itemMap = {};
    const filtered = data.filter(order => {
      const orderDate = new Date(order.created_at);
      return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
    });

    filtered.forEach(order => {
      total += order.total_amount;
      order.items.forEach(item => {
        const key = `${item.title} (${item.size})`;
        itemMap[key] = (itemMap[key] || 0) + item.quantity;
      });
    });

    const mostSold = Object.entries(itemMap).sort((a, b) => b[1] - a[1])[0];

    setStats({
      totalOrders: filtered.length,
      totalRevenue: total,
      mostSold: mostSold ? { name: mostSold[0], quantity: mostSold[1] } : {},
    });
  };

  const getNextStatus = (current) => {
    if (!current || current === 'pending') return 'accepted';
    if (current === 'accepted') return 'shipped';
    if (current === 'shipped') return 'delivered';
    return null;
  };

  const getStatusButtonText = (status) => {
    if (!status || status === 'pending') return 'Accept Order';
    if (status === 'accepted') return 'Mark Shipped';
    if (status === 'shipped') return 'Mark Delivered';
    return 'Delivered';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Admin Dashboard</h1>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <label className="text-sm text-gray-700">From: <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="border p-1 rounded" /></label>
        <label className="text-sm text-gray-700">To: <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="border p-1 rounded" /></label>
        <button onClick={() => computeStats(orders)} className="bg-black text-white px-4 py-2 rounded">Apply Filter</button>
        <button onClick={() => { setStartDate(null); setEndDate(null); computeStats(orders); }} className="text-sm underline text-gray-600 ml-2">Reset</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-semibold">{stats.totalOrders}</h2>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-semibold">₹{stats.totalRevenue}</h2>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-500">Top Product</p>
          <h2 className="text-lg font-medium">{stats.mostSold.name || '-'}</h2>
          <p className="text-sm">Sold: {stats.mostSold.quantity || 0}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">🧾 All Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const nextStatus = getNextStatus(order.status);
          const isFinal = order.status === 'delivered';

          return (
            <div key={order.id} className="border p-4 rounded bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">User: {order.customer_info?.name}</p>
                  <p className="text-sm text-gray-600">Email: {order.customer_info?.email}</p>
                  <p className="text-sm text-gray-600">Phone: {order.customer_info?.phone}</p>
                  <p className="text-sm text-gray-600">
                    Address: {order.customer_info?.address}, {order.customer_info?.city}, {order.customer_info?.state} - {order.customer_info?.pincode}
                  </p>
                </div>
                <div className="text-right text-sm font-bold text-green-600">
                  Status: {order.status || 'Pending'}
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p className="font-medium mb-1">Items:</p>
                <ul className="ml-4 list-disc text-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} × {item.quantity} ({item.size})
                      {item.isCustom && item.image && (
                        <a
                          href={item.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="ml-2 text-blue-600 underline"
                        >
                          Download
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center mt-3 text-sm font-semibold">
                <span>Total: ₹{order.total_amount}</span>
              </div>
              {!isFinal && nextStatus && (
                <div className="mt-3">
                  <button
                    onClick={() => updateStatus(order.id, nextStatus)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                  >
                    {getStatusButtonText(order.status)}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
