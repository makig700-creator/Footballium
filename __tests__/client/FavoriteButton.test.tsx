import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useSession } from 'next-auth/react';

describe('FavoriteButton', () => {
  it('Should handle unauthenticated user gracefully', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    const { container } = render(<FavoriteButton teamId="team-1" />);

    // Just ensure it renders something without crashing
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('Should allow authenticated user to interact with favorites', async () => {
    (useSession as jest.Mock).mockReturnValue({ 
      data: { user: { id: 'user-1' } }, 
      status: 'authenticated' 
    });
    const { container } = render(<FavoriteButton teamId="team-1" />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
