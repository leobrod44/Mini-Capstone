import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditPropertyComponent from '../components/EditPropertyComponent';
import { updateProperty } from '../backend/PropertyHandler';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    propertyID: '123',
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../backend/PropertyHandler', () => ({
  getProperties: jest.fn().mockResolvedValue([
    {
      propertyID: '123',
      picture: null,
      propertyName: 'Test Property',
      address: 'Test Address',
      unitCount: 5,
      parkingCount: 10,
      parkingPrice: 50,
      lockerCount: 3,
      lockerPrice: 20,
    },
  ]),
  updateProperty: jest.fn().mockResolvedValue(),
  deleteProperty: jest.fn().mockResolvedValue(),
}));

describe('EditPropertyComponent', () => {
  test('renders without crashing', async () => {
    render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
  });

  test('displays the title', async () => {
    const { getByText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    getByText('My Property');
  });

  test('handles file change', async () => {
    const { getByLabelText } = render(
      <Router>
        <EditPropertyComponent toggleEdit={() => {}} />
      </Router>
    );
    const fileInput = getByLabelText('Property Picture:');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.jpg', { type: 'image/jpeg' })] } });
  });
});
