import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs/Tabs"; // Import from local Tabs component
import { Source } from "@storybook/blocks";

export interface PlatformSnippetsProps {
  react?: string;
  vue?: string;
  swift?: string;
  kotlin?: string;
}

export const PlatformSnippets = ({
  react,
  vue,
  swift,
  kotlin,
}: PlatformSnippetsProps) => {
  const snippets = [
    { value: "react", label: "React", code: react, language: "tsx" },
    { value: "vue", label: "Vue 3", code: vue, language: "html" },
    { value: "swift", label: "Swift (iOS)", code: swift, language: "swift" },
    {
      value: "kotlin",
      label: "Kotlin (Android)",
      code: kotlin,
      language: "kotlin",
    },
  ].filter(
    (
      snippet,
    ): snippet is {
      value: string;
      label: string;
      code: string;
      language: string;
    } => Boolean(snippet.code),
  );

  if (snippets.length === 0) {
    return null;
  }

  return (
    <Tabs
      defaultValue={snippets[0].value}
      className="w-full mt-6 border rounded-control"
    >
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        {snippets.map((snippet) => (
          <TabsTrigger
            key={snippet.value}
            value={snippet.value}
            className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {snippet.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {snippets.map((snippet) => (
        <TabsContent key={snippet.value} value={snippet.value} className="mt-0">
          {/* @ts-expect-error language prop is poorly typed */}
          <Source code={snippet.code} language={snippet.language} dark />
        </TabsContent>
      ))}
    </Tabs>
  );
};
