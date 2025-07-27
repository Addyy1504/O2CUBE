import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Arrow = ({ onClick, direction }) => (
  <div
    className={`absolute top-1/2 ${direction === 'left' ? 'left-2' : 'right-2'} text-black text-2xl cursor-pointer z-10`}
    onClick={onClick}
    style={{ transform: 'translateY(-50%)' }}
  >
    {direction === 'left' ? '‹' : '›'}
  </div>
);

const ProductGrid = ({ category, slug, onAdd, categories }) => {
  const { products, setProducts } = useProducts();
  const [productLimit, setProductLimit] = useState(20);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', imageInputs: [''] });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = userEmail === 'o2cube02@gmail.com';

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), where('category', '==', category), where('subCategory', '==', slug));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(data);
    };
    fetchProducts();
  }, [category, slug]);

  const currentCategory = categories?.find(c => c.slug === slug)?.name || slug;
  const filtered = products.slice(0, productLimit);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
  };

  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize(null);
  };

  const closeModal = () => {
    setModalProduct(null);
    setSelectedSize(null);
  };

  const handleAdd = () => {
    if (!selectedSize) return toast.error('Please select a size');
    onAdd({ ...modalProduct, size: selectedSize.label, price: selectedSize.price });
    toast.success(`${modalProduct.title} added to cart`);
    closeModal();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAdminAdd = async () => {
    if (!newProduct.title || !newProduct.imageInputs[0]) return toast.error("Fill all fields");
    const newEntry = {
      title: newProduct.title,
      description: `High-quality ${category} piece.`,
      basePrice: category === 'Canvas' ? 799 : 399,
      category,
      subCategory: slug,
      sizes: category === 'Canvas'
        ? [ { label: '8x12 inch', price: 799 }, { label: '16x20 inch', price: 1299 }, { label: '20x30 inch', price: 1799 } ]
        : [ { label: '24x24 inch', price: 399 }, { label: '30x40 inch', price: 599 }, { label: '40x50 inch', price: 799 } ],
      images: newProduct.imageInputs.filter(Boolean),
    };
    const docRef = await addDoc(collection(db, 'products'), newEntry);
    setProducts(prev => [...prev, { ...newEntry, id: docRef.id }]);
    toast.success("Product Added!");
    setShowAdminModal(false);
    setNewProduct({ title: '', imageInputs: [''] });
  };

  const handleEditSave = async () => {
    const ref = doc(db, 'products', editingProduct.id);
    const updatedProduct = {
      title: editingProduct.title,
      images: editingProduct.imageInputs.filter(Boolean),
    };
    await updateDoc(ref, updatedProduct);
    const updated = products.map(p =>
      p.id === editingProduct.id ? { ...p, ...updatedProduct } : p
    );
    setProducts(updated);
    setShowEditModal(false);
    toast.success("Product updated!");
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6">{currentCategory}</h2>

      {isAdmin && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <button onClick={() => setShowAdminModal(true)} className="bg-white text-black px-4 py-2 rounded">➕ Add Product</button>
          <label className="text-white text-sm">
            Show <select value={productLimit} onChange={(e) => setProductLimit(parseInt(e.target.value))} className="bg-white text-black rounded px-2 py-1 ml-1">
              {[5,10,15,20,30].map(num => <option key={num}>{num}</option>)}
            </select> products
          </label>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="border rounded shadow-sm bg-white text-black relative p-4 flex flex-col">
            {isAdmin && (
              <>
                <button onClick={() => handleDelete(product.id)} className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 rounded">✕</button>
                <button onClick={() => { setEditingProduct({ ...product, imageInputs: product.images || [''] }); setShowEditModal(true); }} className="absolute top-2 left-2 text-sm bg-blue-500 text-white px-2 rounded">✎</button>
              </>
            )}
            <div className="relative pb-6">
              <Slider {...sliderSettings}>
                {product.images?.map((img, idx) => (
                  <div key={idx}>
                    <img src={img} alt="" className="w-full max-h-64 object-contain rounded" />
                  </div>
                ))}
              </Slider>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg mt-2 hover:underline">{product.title}</h3>
            </Link>
            <p className="text-sm text-gray-600 mb-2">Starts at ₹{product.basePrice}</p>
            <button onClick={() => openModal(product)} className="bg-black text-white py-1 px-4 rounded w-full mt-auto hover:bg-[#ff2aa3] transition-colors duration-200">Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center mt-10 gap-3">
        {Array.from(new Map(categories.map(cat => [cat.slug, cat])).values()).map(cat => (
          <button key={cat.slug} onClick={() => navigate(`/${category === 'Canvas' ? 'canvas' : 'flags'}/${cat.slug}`)} className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${cat.slug === slug ? 'bg-pink-600 text-white' : 'border border-white text-white hover:bg-pink-600 hover:text-white'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/customise" className="inline-block px-6 py-2 bg-pink-600 text-white text-sm font-semibold rounded-full hover:bg-black transition-all">
          Didn’t find your vibe? Customize Your Art 🎨
        </Link>
      </div>

      {/* Modals */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 text-black">
            <h3 className="text-xl font-semibold mb-4">{modalProduct.title}</h3>
            <div className="grid gap-3 mb-4">
              {modalProduct.sizes.map((size) => (
                <button key={size.label} onClick={() => setSelectedSize(size)} className={`border rounded px-4 py-2 ${selectedSize?.label === size.label ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {size.label} - ₹{size.price}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={closeModal} className="text-sm underline text-gray-500">Cancel</button>
              <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded">Confirm Add</button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <input type="text" placeholder="Title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full border p-2 mb-3" />
            {newProduct.imageInputs.map((url, i) => (
              <input key={i} type="text" placeholder={`Image URL ${i + 1}`} value={url} onChange={(e) => {
                const inputs = [...newProduct.imageInputs];
                inputs[i] = e.target.value;
                setNewProduct({ ...newProduct, imageInputs: inputs });
              }} className="w-full border p-2 mb-2" />
            ))}
            <button onClick={() => setNewProduct(prev => ({ ...prev, imageInputs: [...prev.imageInputs, ''] }))} className="text-blue-500 text-sm underline mb-3">+ Add another image</button>
            <div className="flex justify-between">
              <button onClick={() => setShowAdminModal(false)} className="text-sm text-gray-500 underline">Cancel</button>
              <button onClick={handleAdminAdd} className="bg-black text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <input type="text" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} className="w-full border p-2 mb-3" />
            {editingProduct.imageInputs.map((url, i) => (
              <input key={i} type="text" value={url} onChange={(e) => {
                const inputs = [...editingProduct.imageInputs];
                inputs[i] = e.target.value;
                setEditingProduct({ ...editingProduct, imageInputs: inputs });
              }} className="w-full border p-2 mb-2" />
            ))}
            <button onClick={() => setEditingProduct(prev => ({ ...prev, imageInputs: [...prev.imageInputs, ''] }))} className="text-blue-500 text-sm underline mb-3">+ Add another image</button>
            <div className="flex justify-between">
              <button onClick={() => setShowEditModal(false)} className="text-sm text-gray-500 underline">Cancel</button>
              <button onClick={handleEditSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 text-center bg-white py-10 px-4 rounded text-black">
        <p className="text-xl italic font-playfair max-w-3xl mx-auto">
          “Your walls should speak your vibe, not your landlord’s beige.”
        </p>
        <p className="mt-4 text-sm text-gray-600 font-special">— O2cube</p>
      </div>

      <footer className="bg-black text-white py-8 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
          <p className="text-sm">&copy; 2025 O2cube. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0 text-sm">
            <Link to="/about" className="hover:text-pink-500 transition">About</Link>
            <Link to="/contact" className="hover:text-pink-500 transition">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-pink-500 transition">Privacy</Link>
            <Link to="/return-policy" className="hover:text-pink-500 transition">Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductGrid;
