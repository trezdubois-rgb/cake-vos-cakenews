import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthNew from './AuthNew';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: null,
        loading: false,
    }),
}));

jest.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            signUp: jest.fn(),
            signInWithPassword: jest.fn(),
        },
    },
}));

describe('AuthNew Component', () => {
    test('renders auth tabs correctly', () => {
        render(
            <BrowserRouter>
                <AuthNew />
            </BrowserRouter>
        );

        expect(screen.getByText('Inscription')).toBeInTheDocument();
        expect(screen.getByText('Connexion')).toBeInTheDocument();
        expect(screen.getByText('Équipe')).toBeInTheDocument();
    });

    test('renders signup form by default', () => {
        render(
            <BrowserRouter>
                <AuthNew />
            </BrowserRouter>
        );

        expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
        expect(screen.getByText('Créer mon compte')).toBeInTheDocument();
    });
});
