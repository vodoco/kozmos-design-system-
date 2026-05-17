import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
    it('renders correctly', () => {
        render(<Heading level={1}>Title</Heading>);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Title').tagName).toBe('H1');
    });

    it('renders correct levels', () => {
        const { container } = render(<Heading level={3}>Subtitle</Heading>);
        expect(container.querySelector('h3')).toBeInTheDocument();
    });
});
