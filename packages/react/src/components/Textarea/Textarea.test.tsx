import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from './Textarea';
import '@testing-library/jest-dom/vitest';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea defaultValue="Test Content" />);
    expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument();
  });

  it('renders label with correct htmlFor association', () => {
    render(<Textarea label="Description" />);
    const textarea = screen.getByRole('textbox');
    const label = screen.getByText('Description');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', textarea.id);
  });

  it('renders error message with aria-describedby linkage', () => {
    render(<Textarea error="Field is required" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby');

    const errorMessage = screen.getByText('Field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(textarea.getAttribute('aria-describedby')).toBe(errorMessage.id);
  });

  it('renders boolean error without error text', () => {
    render(<Textarea error={true} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).not.toHaveAttribute('aria-describedby');
  });
});
