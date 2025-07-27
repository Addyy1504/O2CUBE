import React from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from './ProductGrid';

const categoryMap = {
  'football': 'Wall Flags',
  'nba': 'Wall Flags',
  'anime': 'Wall Flags',
  'pop': 'Wall Flags',
  'abstracts': 'Wall Flags',
};

const flagCategories = [
  { name: 'Football Clubs', slug: 'football' },
  { name: 'NBA Legends', slug: 'nba' },
  { name: 'Anime Vibes', slug: 'anime' },
  { name: 'Pop Culture', slug: 'pop' },
  { name: 'Abstracts', slug: 'abstracts' },
];

const FlagsCategoryPage = ({ onAdd }) => {
  const { slug } = useParams();
  const category = categoryMap[slug];

  // Handle invalid slugs gracefully
  if (!category) {
    return (
      <div className="text-white p-6">
        Invalid flag category. Please go back and select a valid option.
      </div>
    );
  }

  return (
    <ProductGrid
      category={category}
      slug={slug}
      onAdd={onAdd}
      categories={flagCategories}
    />
  );
};

export default FlagsCategoryPage;
