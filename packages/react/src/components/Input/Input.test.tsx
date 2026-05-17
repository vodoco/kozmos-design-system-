import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Input } from './Input';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);

describe('Input', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<Input />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders error messages and aria attributes correctly', () => {
    const { getByRole, getByText } = render(<Input error="This is an error message" />);
    const input = getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    
    const errorMessage = getByText('This is an error message');
    expect(errorMessage).toBeInTheDocument();
    
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBe(errorMessage.id);
  });
});

