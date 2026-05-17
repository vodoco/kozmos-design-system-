import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from './Checkbox';
import '@testing-library/jest-dom/vitest';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label with correct htmlFor association', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('renders error message with aria-describedby linkage', () => {
    render(<Checkbox error="You must accept" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby');

    const errorMessage = screen.getByText('You must accept');
    expect(errorMessage).toBeInTheDocument();
    expect(checkbox.getAttribute('aria-describedby')).toBe(errorMessage.id);
  });

  it('renders boolean error without error text', () => {
    render(<Checkbox error={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).not.toHaveAttribute('aria-describedby');
  });
});
