import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AuthContext } from '@/contexts/AuthContext';
import React from 'react';

describe('useAuth', () => {
  it('throws error when used outside AuthProvider', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toContain('useAuth must be used within');
  });

  it('returns context when used within AuthProvider', () => {
    const mockContext = {
      user: { id: '123', email: 'test@test.com' },
      loading: false,
      isAdmin: true,
      signOut: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockContext.user);
    expect(result.current.isAdmin).toBe(true);
  });
});

