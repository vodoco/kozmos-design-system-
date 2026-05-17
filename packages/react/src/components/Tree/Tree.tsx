import React from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { cn } from '../../utils';

interface TreeItem {
    id: string;
    name: string;
    children?: TreeItem[];
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
    data: TreeItem[];
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
    ({ className, data, ...props }, ref) => (
        <div ref={ref} className={cn('text-sm', className)} {...props}>
            {data.map((item) => (
                <TreeNode key={item.id} item={item} />
            ))}
        </div>
    )
);
Tree.displayName = 'Tree';

const TreeNode = ({ item }: { item: TreeItem }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div>
            <div
                className={cn(
                    'flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-muted/50',
                    !hasChildren && 'pl-6'
                )}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
            >
                {hasChildren && (
                    <span className="mr-1">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </span>
                )}
                <span className="mr-2">
                    {hasChildren ? <Folder className="h-4 w-4 text-blue-500" /> : <File className="h-4 w-4 text-gray-500" />}
                </span>
                {item.name}
            </div>
            {isOpen && hasChildren && (
                <div className="pl-4 border-l border-muted ml-2">
                    {item.children!.map((child) => (
                        <TreeNode key={child.id} item={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export { Tree, type TreeItem };
