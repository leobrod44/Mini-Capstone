import React from "react";

function Pagination(props) {
  const { propertiesPerPage, totalProperties, currentPage, setCurrentPage } = props;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalProperties / propertiesPerPage); i++) {
    pageNumbers.push(i);
  }

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
        disabled={currentPage === Math.ceil(totalProperties / propertiesPerPage) ? true : false}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;