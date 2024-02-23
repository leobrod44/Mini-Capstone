import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popup from '../components/Popup';
import { BrowserRouter } from 'react-router-dom';

describe('Popup Component', () => {
  it('renders the popup content correctly', () => {
    render(
    <BrowserRouter>
    <Popup handleClose={() => {}} />
    </BrowserRouter>
    ); 

    // Check if popup content is rendered correctly
    expect(screen.getByText('Register your condo')).toBeInTheDocument();
    expect(screen.getByLabelText('Key:')).toBeInTheDocument();
    expect(screen.getByText('Submit Key')).toBeInTheDocument();
  });


});