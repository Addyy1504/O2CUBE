const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // ⬅️ must exist

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = admin.firestore();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const upload = multer({ dest: 'uploads/' });

// ---- AUTH MIDDLEWARE ----
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ---- PRODUCTS ----
app.get('/api/products', async (req, res) => {
  const snapshot = await firestore.collection('products').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(products);
});

app.post('/api/products', authMiddleware, async (req, res) => {
  if (req.user.email !== 'o2cube02@gmail.com') {
    return res.status(403).json({ error: 'Only admin can add products' });
  }
  const { title, imageUrl, category, price } = req.body;
  const docRef = await firestore.collection('products').add({
    title,
    imageUrl,
    category,
    price,
    created_at: new Date().toISOString(),
  });
  res.json({ success: true, id: docRef.id });
});

// ---- ORDERS ----
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, total_amount, customer_info } = req.body;
  await firestore.collection('orders').add({
    userId: req.user.uid,
    email: req.user.email,
    items,
    total_amount,
    customer_info,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
  res.json({ success: true });
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  let snapshot;
  if (req.user.email === 'o2cube02@gmail.com') {
    snapshot = await firestore.collection('orders').orderBy('created_at', 'desc').get();
  } else {
    snapshot = await firestore.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('created_at', 'desc')
      .get();
  }
  const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(orders);
});

app.patch('/api/orders/:id/status', authMiddleware, async (req, res) => {
  if (req.user.email !== 'o2cube02@gmail.com') {
    return res.status(403).json({ error: 'Only admin can update order status' });
  }
  const { status } = req.body;
  await firestore.collection('orders').doc(req.params.id).update({ status });
  res.json({ success: true });
});

// ---- FILE UPLOAD ----
app.post('/api/upload', upload.single('file'), (req, res) => {
  const domain = process.env.DOMAIN || `http://localhost:${PORT}`;
  res.json({ url: `${domain}/uploads/${req.file.filename}` });
});

// ---- CASHFREE PAYMENT ----
app.post('/api/create-cashfree-order', async (req, res) => {
  const { orderAmount, customerName, customerEmail, customerPhone } = req.body;
  const cleanCustomerId = customerEmail.replace(/[^a-zA-Z0-9_-]/g, '');
  const orderId = 'order_' + Date.now();
  const headers = {
    'x-client-id': process.env.CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
    'x-api-version': '2022-09-01',
    'Content-Type': 'application/json',
  };
  const payload = {
    order_id: orderId,
    order_amount: orderAmount,
    order_currency: 'INR',
    customer_details: {
      customer_id: cleanCustomerId,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_name: customerName,
    },
  };
  try {
    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      payload,
      { headers }
    );
    res.json({
      success: true,
      orderId,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (error) {
    console.error('Cashfree Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// ---- START SERVER ----
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
