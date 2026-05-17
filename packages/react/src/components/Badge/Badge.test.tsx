import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Test Content</Badge>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
