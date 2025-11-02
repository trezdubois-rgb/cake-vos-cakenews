import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as useAuthModule from '@/hooks/useAuth';

import ProtectedRoute from './ProtectedRoute';

vi.mock('@/hooks/useAuth');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when auth is loading', () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      loading: true,
      isAdmin: false,
      signOut: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('renders children for authenticated user', () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: { id: '123', email: 'test@test.com' },
      loading: false,
      isAdmin: false,
      signOut: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('blocks non-admin when requireAdmin is true', () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: { id: '123', email: 'test@test.com' },
      loading: false,
      isAdmin: false,
      signOut: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAdmin>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('allows admin when requireAdmin is true', () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: { id: '123', email: 'admin@test.com' },
      loading: false,
      isAdmin: true,
      signOut: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAdmin>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});

