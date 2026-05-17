import { render, screen } from '@testing-library/react';
import { Link } from './Link';
import { describe, it, expect } from 'vitest';

describe('Link', () => {
    it('renders correctly', () => {
        render(<Link href="#">Link</Link>);
        expect(screen.getByRole('link')).toHaveTextContent('Link');
    });
});
