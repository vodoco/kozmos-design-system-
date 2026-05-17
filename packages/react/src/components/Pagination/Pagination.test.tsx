import { render, screen } from '@testing-library/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from './Pagination';
import { describe, it, expect } from 'vitest';

describe('Pagination', () => {
    it('renders correctly', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
