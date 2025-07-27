import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

const canvasSizes = ['8x12 inch', '16x20 inch', '20x30 inch'];
const tapestrySizes = ['24x24 inch', '30x40 inch', '40x50 inch'];

const canvasPrices = {
  '8x12 inch': 799,
  '16x20 inch': 1299,
  '20x30 inch': 1799,
};

const tapestryPrices = {

  '24x24 inch': 399,
  '30x40 inch': 599,
  '40x50 inch': 799,
};

const productTypes = ['Canvas', 'Tapestry'];

const CustomizationHub = ({ onAdd }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.svg'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const getPrice = () => {
    if (!selectedType || !selectedSize) return 0;
    return selectedType === 'Canvas'
      ? canvasPrices[selectedSize] || 0
      : tapestryPrices[selectedSize] || 0;
  };

  const handleAddToCart = () => {
    if (!selectedType || !selectedSize || !uploadedFile) {
      alert('Please complete all fields and upload a file.');
      return;
    }

    const item = {
      id: `${selectedType}-${selectedSize}-${uploadedFile.name}`,
      title: `Custom ${selectedType}`,
      size: selectedSize,
      price: getPrice(),
      image: URL.createObjectURL(uploadedFile),
      quantity: 1,
      isCustom: true,
      file: uploadedFile,
    };

    onAdd(item);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white flex flex-col items-center space-y-10">
      <div className="w-full max-w-6xl rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-white border border-black">
        {/* Upload Preview */}
        <div
          {...getRootProps()}
          className="flex flex-col justify-center items-center border-2 border-dashed border-black p-6 rounded-lg transition hover:border-[#ff2e88] hover:shadow-md bg-white text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {uploadedFile ? (
            <>
              <p className="text-[#ff2e88] font-medium mb-2">✅ {uploadedFile.name}</p>
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded shadow"
              />
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Drag & drop or click to upload PNG, JPG, JPEG or SVG
            </p>
          )}
        </div>

        {/* Right Form Section */}
        <div className="flex flex-col justify-between space-y-6">
          <h1 className="text-3xl font-bold text-black">🎨 Customize Your Art</h1>

          {/* Type Buttons */}
          <div>
            <p className="text-gray-800 font-medium mb-2">Select Product Type</p>
            <div className="flex gap-3 flex-wrap">
              {productTypes.map((type) => (
                <button
                  key={type}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 border text-sm ${
                    selectedType === type
                      ? 'bg-black text-white border-black scale-105'
                      : 'bg-white text-black border-black hover:bg-[#ff2e88] hover:text-white hover:border-[#ff2e88]'
                  }`}
                  onClick={() => {
                    setSelectedType(type);
                    setSelectedSize('');
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Size Buttons */}
          {selectedType && (
            <div>
              <p className="text-gray-800 font-medium mb-2">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {(selectedType === 'Canvas' ? canvasSizes : tapestrySizes).map((size) => (
                  <button
                    key={size}
                    className={`px-6 py-2 rounded-full font-medium text-sm border transition-all ${
                      selectedSize === size
                        ? 'bg-[#ff2e88] text-white border-[#ff2e88] scale-105'
                        : 'bg-white text-black border-black hover:bg-[#ff2e88] hover:text-white hover:border-[#ff2e88]'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Display */}
          <div className="text-right">
            <span className="inline-block px-6 py-3 text-xl font-bold bg-black text-white rounded-full shadow-md">
              ₹{getPrice()} Total
            </span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#ff2e88] text-white text-lg font-semibold py-3 rounded-full shadow hover:bg-black transition"
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>

      {/* Upload Guidelines Below */}
      <div className="w-full max-w-6xl rounded-xl border border-black p-6 shadow bg-white">
        <h2 className="text-xl font-semibold text-black mb-4">📌 Upload Guidelines</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>🖼️ Use high-resolution images (1500px+ recommended).</li>
          <li>📁 Supported formats: PNG, JPG, JPEG, SVG (max 10MB).</li>
          <li>⚠️ Avoid blurry screenshots or low-quality designs — they don’t print well.</li>
          <li>🧩 Keep important parts of your design away from the edges to prevent cropping.</li>
          <li>🛠️ We may slightly adjust your design to ensure it fits the canvas perfectly — no major edits will be made.</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomizationHub;
