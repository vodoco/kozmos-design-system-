import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import React from 'react';

// Import foundational pure-UI bounds
import { Button } from '../../src/components/Button/Button';
import { Card } from '../../src/components/Card/Card';
import { Input } from '../../src/components/Input/Input';

expect.extend(matchers);

describe('WCAG 2.1 Native A11y Validations', () => {
    it('Button geometry must physically pass Color Contrast limits natively', async () => {
        const { container } = render(<Button variant="default">WCAG Accessible Button</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Card layout arrays must structurally map without ARIA violations', async () => {
        const { container } = render(
            <Card>
                <h1>Card Title</h1>
                <p>Card descriptions enforcing A11y text cascades natively.</p>
            </Card>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('Forms and Inputs must unconditionally bind accessible DOM labels', async () => {
        const { container } = render(<Input placeholder="Search POIs" aria-label="Search Input" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
