import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import { Card, CardContent, CardFooter, CardHeader } from '../Card/Card';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface POICardProps extends React.HTMLAttributes<HTMLDivElement> {
    imageUrl?: string;
    title: string;
    subtitle?: string;
    description?: React.ReactNode;
    badges?: React.ReactNode;
    actions?: React.ReactNode;
}

export const POICard = forwardRef<HTMLDivElement, POICardProps>(
    ({ className, imageUrl, title, subtitle, description, badges, actions, onClick, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();

        return (
            <Card 
                ref={ref} 
                className={cn('overflow-hidden flex flex-col', onClick ? 'cursor-pointer hover:shadow-xl transition-all' : '', className)} 
                onClick={onClick ? (e) => {
                    trackEvent('POICard', 'poi_selected', { title, subtitle });
                    onClick(e);
                } : undefined}
                {...props}
            >
                {imageUrl && (
                    <div className="w-full h-48 relative overflow-hidden bg-muted">
                        <img 
                            src={imageUrl} 
                            alt={title} 
                            className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
                        />
                    </div>
                )}
                
                <CardHeader className={cn("pb-2", imageUrl ? "pt-5" : "")}>
                    <div className="flex flex-col gap-1.5">
                        <Heading level={3} className="tracking-tight text-xl">{title}</Heading>
                        {subtitle && <Text className="text-sm font-medium text-muted-foreground">{subtitle}</Text>}
                    </div>
                    {badges && (
                        <div className="flex flex-wrap gap-2 mt-3 text-sm">
                            {badges}
                        </div>
                    )}
                </CardHeader>
                
                {description && (
                    <CardContent className="py-2 text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </CardContent>
                )}

                {actions && (
                    <CardFooter className="pt-4 pb-5 flex flex-wrap gap-3">
                        {actions}
                    </CardFooter>
                )}
            </Card>
        );
    }
);

POICard.displayName = 'POICard';
