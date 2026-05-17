import { render, screen } from '@testing-library/react';
import { IconButton } from './IconButton';
import { describe, it, expect } from 'vitest';
import { Search } from 'lucide-react';

describe('IconButton', () => {
    it('renders correctly', () => {
        render(<IconButton aria-label="search"><Search /></IconButton>);
        expect(screen.getByLabelText('search')).toBeInTheDocument();
    });
});
