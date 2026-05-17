import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from './Breadcrumb';
import { describe, it, expect } from 'vitest';

describe('Breadcrumb', () => {
    it('renders correctly', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Current')).toBeInTheDocument();
    });
});
