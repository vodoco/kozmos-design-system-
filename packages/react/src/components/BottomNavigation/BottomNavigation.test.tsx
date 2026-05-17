import { render, screen } from '@testing-library/react';
import { BottomNavigation } from './BottomNavigation';
import { Home } from 'lucide-react';
import { describe, it, expect } from 'vitest';

describe('BottomNavigation', () => {
    it('renders items correctly', () => {
        render(
            <BottomNavigation
                items={[
                    { icon: <Home data-testid="icon" />, label: 'Home' }
                ]}
            />
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});
