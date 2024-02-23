import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Pagination from "../components/Pagination";

test('Pagination component renders correctly', () => {
  const setCurrentPage = jest.fn();
  render(<Pagination itemsPerPage={4} totalItems={8} currentPage={1} setCurrentPage={setCurrentPage} />);
  
  expect(screen.getByText('Previous')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('Next')).toBeInTheDocument();
});
