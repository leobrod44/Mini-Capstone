import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import AddCondoBtn from '../components/AddCondoBtn';

describe('AddCondoBtn Component', () => {
  it('renders the button correctly', () => {
    render(<AddCondoBtn />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('floating_button');
  });

  it('calls the onClick function when the button is clicked', () => {
    const handleClick = jest.fn();
    render(<AddCondoBtn onClick={handleClick} />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});