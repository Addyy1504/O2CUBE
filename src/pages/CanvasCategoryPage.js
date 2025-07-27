import React from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from './ProductGrid';

// Maps slug to the master category name
const categoryMap = {
  'motivation': 'Canvas',
  'tv-shows': 'Canvas',
  'hindu-gods': 'Canvas',
  'genz': 'Canvas',
  'line-art': 'Canvas',
  'f-bold': 'Canvas',
};

// Human-friendly category buttons
const canvasCategories = [
  { name: 'Motivation', slug: 'motivation' },
 { name: 'Divine strokes', slug: 'tv-shows' },
  { name: 'Netflix Nirvana', slug: 'hindu-gods' },
  { name: 'GenZ Aesthetics', slug: 'genz' },
  { name: 'Line Minimal', slug: 'line-art' },
  { name: 'Formula 1', slug: 'f-bold' },
];

const CanvasCategoryPage = ({ onAdd }) => {
  const { slug } = useParams();
  const category = categoryMap[slug];

  // Safety fallback if slug is wrong or missing
  if (!category) {
    return (
      <div className="text-white p-6">
        Invalid category. Please go back and select a valid canvas category.
      </div>
    );
  }

  return (
    <ProductGrid
      category={category}
      slug={slug}
      onAdd={onAdd}
      categories={canvasCategories}
    />
  );
};

export default CanvasCategoryPage;
