import { cn } from './utils';

describe('cn utility', () => {
    test('merges class names correctly', () => {
        expect(cn('c-1', 'c-2')).toBe('c-1 c-2');
    });

    test('handles conditional classes', () => {
        expect(cn('c-1', true && 'c-2', false && 'c-3')).toBe('c-1 c-2');
    });

    test('merges tailwind classes correctly', () => {
        expect(cn('p-4 p-2')).toBe('p-2');
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    test('handles arrays and objects', () => {
        expect(cn(['c-1', 'c-2'])).toBe('c-1 c-2');
        expect(cn({ 'c-1': true, 'c-2': false })).toBe('c-1');
    });
});
