import { render, screen } from '@testing-library/react';
import { Search } from './Search';
import { describe, it, expect } from 'vitest';

describe('Search', () => {
    it('renders correctly', () => {
        render(<Search placeholder="test search" />);
        expect(screen.getByPlaceholderText('test search')).toBeInTheDocument();
    });
});
