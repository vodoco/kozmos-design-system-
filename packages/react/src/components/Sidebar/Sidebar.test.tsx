import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { describe, it, expect } from 'vitest';

describe('Sidebar', () => {
    it('renders correctly', () => {
        render(<Sidebar>Content</Sidebar>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
