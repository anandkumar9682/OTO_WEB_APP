import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const getVisiblePages = () => {
    const visiblePages = [];
    const start = Math.max(currentPage - 3, 0);
    const end = Math.min(currentPage + 3, totalPages - 1);

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: 20, flexWrap: 'wrap', gap: '5px' }}>
      {currentPage > 0 && (
        <a
          href="#!"
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#ddd',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#000',
          }}
        >
          Previous
        </a>
      )}

      {visiblePages.map((page) => (
        <a
          href="#!"
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            margin: '0 2px',
            padding: '5px 12px',
            border: '1px solid #EA430E',
            backgroundColor: page === currentPage ? '#0c007d' : '#EA430E',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          {page + 1}
        </a>
      ))}

      {currentPage < totalPages - 1 && (
        <a
          href="#!"
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#ddd',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#000',
          }}
        >
          Next
        </a>
      )}
    </div>
  );
};

export default Pagination;
