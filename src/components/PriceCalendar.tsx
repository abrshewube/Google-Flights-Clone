import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { FlightPrice } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PriceCalendarProps {
  prices: FlightPrice[];
  loading?: boolean;
}

export function PriceCalendar({ prices, loading }: PriceCalendarProps) {
  const itemsPerPage = 21;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(prices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPrices = prices.slice(startIndex, endIndex);

  const lowestPrice = Math.min(...prices.map((p) => p.price));
  const highestPrice = Math.max(...prices.map((p) => p.price));

  const getPriceColor = (price: number) => {
    const range = highestPrice - lowestPrice;
    const threshold1 = lowestPrice + range * 0.33;
    const threshold2 = lowestPrice + range * 0.66;

    if (price <= threshold1) return 'bg-green-50 hover:bg-green-100';
    if (price <= threshold2) return 'bg-yellow-50 hover:bg-yellow-100';
    return 'bg-red-50 hover:bg-red-100';
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!prices.length) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg text-center">
        <p className="text-gray-500">Search for flights to see the price calendar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Price Calendar</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {paginatedPrices.map((price, index) => (
          <motion.div
            key={price.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'p-4 rounded-lg border transition-colors cursor-pointer hover:border-blue-500',
              getPriceColor(price.price)
            )}
          >
            <div className="text-sm font-medium">
              {format(new Date(price.day), 'MMM d')}
            </div>
            <div className="mt-2 text-lg font-bold">${price.price.toFixed(2)}</div>
            <div className="mt-1 text-xs text-gray-500">
              {price.price === lowestPrice && '✨ Lowest Price'}
              {price.price === highestPrice && '📈 Peak Price'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4 px-2">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base whitespace-nowrap min-w-[80px] sm:min-w-[100px] flex justify-center items-center"
          >
            Previous
          </button>

          {/* Mobile page indicator */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm sm:text-base whitespace-nowrap min-w-[80px] sm:min-w-[100px] flex justify-center items-center"
          >
            Next
          </button>
        </div>

        {/* Desktop pagination numbers - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          {currentPage > 2 && (
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm bg-gray-200 rounded"
            >
              1
            </button>
          )}
          {currentPage > 3 && <span className="text-sm">...</span>}

          {Array.from({ length: Math.min(3, totalPages) })
            .map((_, i) => i + Math.max(1, currentPage - 1))
            .filter((page) => page <= totalPages)
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  'px-3 py-2 text-sm bg-gray-200 rounded min-w-[32px]',
                  currentPage === page && 'bg-blue-500 text-white'
                )}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 2 && <span className="text-sm">...</span>}
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm bg-gray-200 rounded"
            >
              {totalPages}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}