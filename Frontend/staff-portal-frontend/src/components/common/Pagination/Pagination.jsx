function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 10;

    for (let i = 0; i < Math.min(totalPages, maxPagesToShow); i++) {
      let pageNum = i + 1;
      if (totalPages > maxPagesToShow) {
        if (currentPage <= 5) pageNum = i + 1;
        else if (currentPage >= totalPages - 4) pageNum = totalPages - 9 + i;
        else pageNum = currentPage - 5 + i;
      }
      pages.push(pageNum);
    }
    return pages;
  };

  return (
    <nav className="mt-6 flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 border rounded-l-lg ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum) => (
          <li key={pageNum}>
            <button
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 border ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border rounded-r-lg ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
