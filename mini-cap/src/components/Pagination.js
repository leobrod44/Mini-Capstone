import React from "react";
import PropTypes from 'prop-types';

/**
 * Functional component representing a pagination component.
 * @param {Object} props - The props object containing itemsPerPage, totalItems, currentPage, and setCurrentPage.
 * @returns {JSX.Element} - The JSX for the pagination component.
 */
function Pagination(props) {
  const { itemsPerPage, totalItems, currentPage, setCurrentPage } = props;

    // Array to store page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

 // Function to handle click on page number button
  const handleClick = (number) => {
    setCurrentPage(number);
  };

  return (
    <div className="pagination">
      <button
        className="prev"
        disabled={currentPage === 1 ? true : false}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Previous
      </button>

      {pageNumbers.map((number) => (
        <button
          id="pageButton"
          key={number}
          className={currentPage === number ? "active" : ""}
          onClick={() => handleClick(number)}
        >
          {number}
        </button>
      ))}

      <button
        className="next"
        disabled={currentPage === Math.ceil(totalItems / itemsPerPage) ? true : false}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

// PropTypes for type-checking props
Pagination.propTypes = {
  itemsPerPage: PropTypes.string, // Number of items per page
  totalItems:PropTypes.string,  // Total number of items
  currentPage: PropTypes.string, // Current page number
  setCurrentPage:PropTypes.string, // Function to set current page
};

export default Pagination;