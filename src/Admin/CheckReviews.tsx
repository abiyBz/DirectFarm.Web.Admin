// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

// interface Product {
//   id: string;
//   name: string;
//   description: string;
// }

// interface Review {
//   id: string;
//   productId: string;
//   userId: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

// interface ProductWithReviews extends Product {
//   reviews: Review[];
//   expanded: boolean;
// }

// const BAD_WORDS = ['hate', 'stupid', 'idiot', 'worthless', 'terrible', 'awful', 'crap', 'sucks', 'damn', 'hell'];

// const CheckReviews: React.FC = () => {
//   const [products, setProducts] = useState<ProductWithReviews[]>([]);
//   const [filter, setFilter] = useState<'all' | 'harmful'>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get('http://localhost:5122/api/Product/GetAllProducts');
//         if (res.data.responseStatus === 1) {
//           const productsData = res.data.data.map((product: Product) => ({
//             ...product,
//             reviews: [],
//             expanded: false,
//           }));
//           setProducts(productsData);
//         } else {
//           setError('Failed to load products.');
//         }
//       } catch (err) {
//         setError('Failed to fetch products.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const fetchReviews = async (productId: string) => {
//     try {
//       const res = await axios.post('http://localhost:5122/api/Product/GetProductReview', { id: productId });
//       if (res.data.responseStatus === 1) {
//         return res.data.data.map((review: any) => ({
//           id: review.id,
//           productId: review.product.id,
//           userId: review.customer.id,
//           rating: review.rating,
//           comment: review.comment,
//           createdAt: review.createdAt,
//         }));
//       }
//       return [];
//     } catch (err) {
//       setError('Failed to fetch reviews.');
//       return [];
//     }
//   };

//   const toggleProduct = async (productId: string) => {
//     setProducts((prev) =>
//       prev.map((product) =>
//         product.id === productId
//           ? { ...product, expanded: !product.expanded }
//           : product
//       )
//     );

//     if (!products.find((p) => p.id === productId)?.reviews.length) {
//       const reviews = await fetchReviews(productId);
//       setProducts((prev) =>
//         prev.map((product) =>
//           product.id === productId ? { ...product, reviews } : product
//         )
//       );
//     }
//   };

//   const containsHarmfulContent = (text: string) =>
//     BAD_WORDS.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(text));

//   const highlightBadWords = (text: string) =>
//     text.split(/\b/).map((word, index) =>
//       BAD_WORDS.includes(word.toLowerCase()) ? (
//         <span key={index} className="bg-red-100 text-red-800 px-1 rounded">
//           {word}
//         </span>
//       ) : (
//         word
//       )
//     );

//   const sortedProducts = products.map((product) => ({
//     ...product,
//     reviews: product.reviews
//       .filter((review) => {
//         const matchesSearch =
//           review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.name.toLowerCase().includes(searchQuery.toLowerCase());

//         return filter === 'harmful' ? matchesSearch && containsHarmfulContent(review.comment) : matchesSearch;
//       })
//       .sort((a, b) => (sortBy === 'date' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.rating - a.rating)),
//   }));

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Product Reviews</h1>

//       <div className="flex gap-4 mb-6">
//         <select className="border px-4 py-2 rounded-lg" value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'harmful')}>
//           <option value="all">All Reviews</option>
//           <option value="harmful">Potentially Harmful</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search reviews..."
//           className="border px-4 py-2 rounded-lg w-64"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />

//         <select className="border px-4 py-2 rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}>
//           <option value="date">Sort by Date</option>
//           <option value="rating">Sort by Rating</option>
//         </select>
//       </div>

//       {sortedProducts.map((product) => (
//         <div key={product.id} className="border rounded-lg mb-4 p-4">
//           <div className="flex justify-between cursor-pointer" onClick={() => toggleProduct(product.id)}>
//             <h2 className="text-xl font-semibold">{product.name}</h2>
//             {product.expanded ? <HiChevronUp /> : <HiChevronDown />}
//           </div>
//           {product.expanded && (
//             <table className="w-full mt-4 border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2">Comment</th>
//                   <th className="border p-2">Rating</th>
//                   <th className="border p-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {product.reviews.map((review) => (
//                   <tr key={review.id} className="border">
//                     <td className="p-2">{highlightBadWords(review.comment)}</td>
//                     <td className="p-2 text-center">{review.rating}</td>
//                     <td className="p-2 text-center">{new Date(review.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CheckReviews;































/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { HiChevronDown, HiChevronUp, HiDownload } from 'react-icons/hi';

interface Product {
  id: string;
  name: string;
  description: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ProductWithReviews extends Product {
  reviews: Review[];
  expanded: boolean;
  loadingReviews: boolean;
}

const BAD_WORDS = ['hate', 'stupid', 'idiot', 'worthless', 'terrible', 'awful', 'crap', 'sucks', 'damn', 'hell'];
const ITEMS_PER_PAGE = 5;

const CheckReviews: React.FC = () => {
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [filter, setFilter] = useState<'all' | 'harmful'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5122/api/Product/GetAllProducts');
        if (res.data.responseStatus === 1) {
          const productsData: ProductWithReviews[] = res.data.data.map((product: Product) => ({
            ...product,
            reviews: [],
            expanded: false,
            loadingReviews: false
          }));
          setProducts(productsData);
        } else {
          setError('Failed to load products.');
        }
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch reviews for a product
  const fetchReviews = useCallback(async (productId: string) => {
    try {
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, loadingReviews: true } : p
      ));

      const res = await axios.post('http://localhost:5122/api/Product/GetProductReview', { id: productId });
      if (res.data.responseStatus === 1) {
        const reviews: Review[] = res.data.data.map((review: any) => ({
          id: review.id,
          productId: review.product.id,
          userId: review.customer.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          status: 'pending'
        }));
        
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, reviews, loadingReviews: false } : p
        ));
      }
    } catch (err) {
      setError('Failed to fetch reviews.');
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, loadingReviews: false } : p
      ));
    }
  }, []);

  // Toggle product expansion
  const toggleProduct = useCallback(async (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, expanded: !product.expanded } : product
    ));

    const product = products.find(p => p.id === productId);
    if (product && !product.reviews.length) {
      await fetchReviews(productId);
    }
  }, [products, fetchReviews]);

  // Filtering and sorting logic
  const containsHarmfulContent = useCallback((text: string) => 
    BAD_WORDS.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text)), []);

  const filteredSortedProducts = useMemo(() => 
    products.map(product => ({
      ...product,
      reviews: product.reviews
        .filter(review => {
          const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRating = ratingFilter ? review.rating >= ratingFilter : true;
          const matchesHarmful = filter === 'harmful' ? containsHarmfulContent(review.comment) : true;
          
          return matchesSearch && matchesRating && matchesHarmful;
        })
        .sort((a, b) => sortBy === 'date' ? 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 
          b.rating - a.rating
        )
    })), [products, searchQuery, filter, sortBy, ratingFilter, containsHarmfulContent]);

  // Pagination
  const paginatedProducts = useMemo(() => 
    filteredSortedProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ), [filteredSortedProducts, currentPage]);

  const totalPages = Math.ceil(filteredSortedProducts.length / ITEMS_PER_PAGE);

  // Export functionality
  const exportToCSV = useCallback(() => {
    const csvContent = [
      ['Product Name', 'Review Comment', 'Rating', 'Status', 'Date'],
      ...filteredSortedProducts.flatMap(product =>
        product.reviews.map(review => [
          `"${product.name.replace(/"/g, '""')}"`,
          `"${review.comment.replace(/"/g, '""')}"`,
          review.rating,
          review.status,
          new Date(review.createdAt).toISOString()
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reviews_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredSortedProducts]);

  // UI Components
  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );

  const HighlightText = ({ text }: { text: string }) => (
    <span>
      {text.split(/\b/).map((word, i) => (
        BAD_WORDS.includes(word.toLowerCase()) ? (
          <mark key={i} className="bg-red-100 text-red-800 px-1 rounded">
            {word}
          </mark>
        ) : word
      ))}
    </span>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse border rounded-lg mb-4 p-4">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product Reviews Management</h1>

      {/* Controls Section */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          className="border px-4 py-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'harmful')}
        >
          <option value="all">All Reviews</option>
          <option value="harmful">Potentially Harmful</option>
        </select>

        <input
          type="text"
          placeholder="Search reviews..."
          className="border px-4 py-2 rounded-lg w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={ratingFilter ?? ''}
          onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        <select
          className="border px-4 py-2 rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
        >
          <option value="date">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <HiDownload /> Export CSV
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        Array(3).fill(0).map((_, i) => <LoadingSkeleton key={i} />)
      ) : (
        <>
          {/* Products List */}
          {paginatedProducts.map(product => (
            <div key={product.id} className="border rounded-lg mb-4 bg-white">
              <div
                role="button"
                tabIndex={0}
                className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleProduct(product.id)}
                onKeyPress={(e) => e.key === 'Enter' && toggleProduct(product.id)}
              >
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {product.reviews.length} reviews
                  </span>
                  {product.expanded ? <HiChevronUp /> : <HiChevronDown />}
                </div>
              </div>

              {/* Reviews Table */}
              {product.expanded && (
                <div className="p-4 border-t">
                  {product.loadingReviews ? (
                    <div className="text-center py-4 text-gray-500">Loading reviews...</div>
                  ) : product.reviews.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No reviews found</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2">Comment</th>
                          <th className="text-left p-2">Rating</th>
                          <th className="text-center p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.reviews.map(review => (
                          <tr key={review.id} className="border-b">
                            <td className="p-2">
                              <HighlightText text={review.comment} />
                              {containsHarmfulContent(review.comment) && (
                                <span className="ml-2 text-red-500 text-sm">(Flagged)</span>
                              )}
                            </td>
                            <td className="p-2 text-center">
                              <RatingStars rating={review.rating} />
                            </td>
                            <td className="p-2 text-center text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckReviews;