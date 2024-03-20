import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CondoRequestsView from '../components/CondoRequestsView.jsx';
import { updateRequest } from '../backend/RequestHandler';

// Mocking the backend function updateRequest
jest.mock('../backend/RequestHandler', () => ({
    updateRequest: jest.fn().mockResolvedValue(2), // Mock the updateRequest function
}));

describe('CondoRequestsView Component', () => {
    const defaultProps = {
        role: 'mgmt',
        type: 'Maintenance',
        notes: 'Request for plumbing repair',
        step: 1,
        condoId: 'condo_123',
        requestId: 'request_456',
    };

    it('renders condo request information correctly', () => {
        render(<CondoRequestsView {...defaultProps} />);

        expect(screen.getByText('Request Type:')).toBeInTheDocument();
        expect(screen.getByText('Description:')).toBeInTheDocument();
        expect(screen.getByText('Status:')).toBeInTheDocument();
        expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('does not render advance button for non-management company role', () => {
        // Change role to 'OWNER'
        const props = { ...defaultProps, role: 'OWNER' };
        render(<CondoRequestsView {...props} />);

        // Check if advance button is not rendered
        expect(screen.queryByText('Advance')).toBeNull();
    });

    it('calls updateRequest function when advance button is clicked', async () => {
        // Render the component with the correct role
        render(<CondoRequestsView {...defaultProps} />);

        // Check if the role is MANAGEMENT_COMPANY
        expect(defaultProps.role).toBe('mgmt');

        // Find the button by its id
        const advanceButton = screen.getByTestId('advance-button');

        // Trigger the advance button click
        fireEvent.click(advanceButton);

        // Wait for updateRequest function to be called
        await waitFor(() => {
            expect(updateRequest).toHaveBeenCalledWith(defaultProps.condoId, defaultProps.requestId);
        });
    });




    it('does not call updateRequest function when request is already in final step', async () => {
        // Change step to 4
        const props = { ...defaultProps, step: 4 };
        render(<CondoRequestsView {...props} />);

        // Trigger the advance button click
        fireEvent.click(screen.getByText('Advance'));

        // Wait for a short delay
        await waitFor(() => {
            // Ensure that updateRequest function is not called
            expect(updateRequest).not.toHaveBeenCalled();
        });
    });
});
