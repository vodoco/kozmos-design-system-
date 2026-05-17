
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@kozmos/react';
import { Source } from '@storybook/blocks';

interface PlatformSnippetsProps {
    react?: string;
    swift?: string;
    kotlin?: string;
}

export const PlatformSnippets = ({ react, swift, kotlin }: PlatformSnippetsProps) => {
    return (
        <Tabs defaultValue="react" className="w-full mt-6 border rounded-md">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                    value="react"
                    className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    React
                </TabsTrigger>
                <TabsTrigger
                    value="swift"
                    className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    Swift (iOS)
                </TabsTrigger>
                <TabsTrigger
                    value="kotlin"
                    className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    Kotlin (Android)
                </TabsTrigger>
            </TabsList>

            {react && (
                <TabsContent value="react" className="mt-0">
                    <Source code={react} language="tsx" dark />
                </TabsContent>
            )}

            {swift && (
                <TabsContent value="swift" className="mt-0">
                    {/* @ts-ignore */}
                    <Source code={swift} language="swift" dark />
                </TabsContent>
            )}

            {kotlin && (
                <TabsContent value="kotlin" className="mt-0">
                    {/* @ts-ignore */}
                    <Source code={kotlin} language="kotlin" dark />
                </TabsContent>
            )}
        </Tabs>
    );
};
