import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductPage = ({ onAdd }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    onAdd({
      ...product,
      size: selectedSize.label,
      price: selectedSize.price
    });
    toast.success(`${product.title} added to cart`);
  };

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true
  };

  const features = [
    "PolyCanvas Fabric",
    "Sturdy Wooden Frame",
    "Fade Proof Print",
    "Perfect for Gifting",
    "Full White Finish",
    "OEKO-TEX Certified Inks",
    "No Minimum Order"
  ];

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!product) return <div className="p-6 text-white">Product not found</div>;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-black text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Slider */}
        <div className="w-full">
          {product.images ? (
            <Slider {...sliderSettings}>
              {product.images.map((img, idx) => (
                <div key={idx} className="w-full">
                  <img
                    src={img}
                    alt=""
                    className="rounded w-full object-contain h-64 sm:h-80 md:h-[400px] bg-white p-2"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={product.image}
              alt=""
              className="rounded w-full object-contain h-64 sm:h-80 md:h-[400px] bg-white p-2"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{product.title}</h2>
            <p className="text-gray-400 mb-4">{product.description}</p>
            <p className="text-lg mb-4 font-medium">Starts at ₹{product.basePrice}</p>

            {/* Size selection */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      selectedSize?.label === size.label
                        ? 'bg-white text-black font-semibold'
                        : 'bg-transparent border-white text-white'
                    } hover:bg-white hover:text-black`}
                  >
                    {size.label} - ₹{size.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              className="w-full bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200"
            >
              Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-xl font-semibold mb-3">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-pink-500 text-lg font-bold">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
