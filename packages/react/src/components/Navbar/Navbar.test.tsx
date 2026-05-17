import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
    it('renders logo and content', () => {
        render(
            <Navbar logo={<span>Logo</span>}>
                <a href="#">Link</a>
            </Navbar>
        );
        expect(screen.getByText('Logo')).toBeInTheDocument();
        expect(screen.getByText('Link')).toBeInTheDocument();
    });
});
