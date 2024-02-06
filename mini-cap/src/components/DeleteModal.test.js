import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DeleteModal from './DeleteModal';

test('DeleteModal buttons call functions when clicked', () => {
    const handleClose = jest.fn();
    const handleDeleteItem = jest.fn();
    const { getByRole } = render(
      <DeleteModal
        show={true}
        handleClose={handleClose}
        handleDeleteItem={handleDeleteItem}
        message=""
      />
    );
    const closeButton = getByRole('button', { name: 'Cancel' });
    const deleteButton = getByRole('button', { name: 'Delete Permanently' });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
    fireEvent.click(deleteButton);
    
    expect(handleDeleteItem).toHaveBeenCalledTimes(1);
});
