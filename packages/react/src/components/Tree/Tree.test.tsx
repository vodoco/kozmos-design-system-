import { render, screen, fireEvent } from '@testing-library/react';
import { Tree, type TreeItem } from './Tree';
import { describe, it, expect } from 'vitest';

const sampleData: TreeItem[] = [
    {
        id: '1',
        name: 'Root',
        children: [
            { id: '2', name: 'Child' }
        ]
    }
];

describe('Tree', () => {
    it('renders correctly', () => {
        render(<Tree data={sampleData} />);
        expect(screen.getByText('Root')).toBeInTheDocument();
    });

    it('expands and collapses', () => {
        render(<Tree data={sampleData} />);
        const root = screen.getByText('Root');
        fireEvent.click(root);
        expect(screen.getByText('Child')).toBeInTheDocument();
    });
});
