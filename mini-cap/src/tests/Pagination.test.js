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

test('Previous button is disabled on the first page', () => {
    const setCurrentPage = jest.fn();
    render(<Pagination itemsPerPage={4} totalItems={8} currentPage={1} setCurrentPage={setCurrentPage} />);
    
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });
  
  test('Next button is disabled on the last page', () => {
    const setCurrentPage = jest.fn();
    render(<Pagination itemsPerPage={4} totalItems={8} currentPage={2} setCurrentPage={setCurrentPage} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
  
  test('Clicking on page numbers updates the current page', () => {
    const setCurrentPage = jest.fn();
    render(<Pagination itemsPerPage={4} totalItems={12} currentPage={1} setCurrentPage={setCurrentPage} />);
    
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });
  
  test('Clicking on Previous button decrements current page', () => {
      const setCurrentPage = jest.fn();
      render(<Pagination itemsPerPage={4} totalItems={8} currentPage={2} setCurrentPage={setCurrentPage} />);
      
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);
      expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
    
    test('Clicking on Next button increments current page', () => {
      const setCurrentPage = jest.fn();
      render(<Pagination itemsPerPage={4} totalItems={8} currentPage={1} setCurrentPage={setCurrentPage} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      expect(setCurrentPage).toHaveBeenCalledWith(2);
    });
    
  