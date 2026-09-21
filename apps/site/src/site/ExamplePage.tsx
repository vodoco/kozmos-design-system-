import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Container,
  Heading,
  List,
  ListItem,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Text,
} from "@kozmos/react";
import { exampleKindLabel, type ExampleEntry } from "../examples/manifest";
import { kozmosImports } from "../lib/kozmos-imports";
import { CodeBlock } from "./CodeBlock";
import { Section } from "./Section";

export interface ExampleFile {
  name: string;
  code: string;
}

/**
 * The frame every example is shown in: where it sits, what it is, the
 * example itself edge to edge, then the Kozmos parts it uses, where Kozmos
 * fell short, and its source.
 */
export function ExamplePage({
  example,
  files,
  children,
}: {
  example: ExampleEntry;
  files: readonly ExampleFile[];
  children: ReactNode;
}) {
  const components = kozmosImports(files.map((file) => file.code).join("\n"));

  return (
    <>
      <Container className="site-example-intro">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <RouterLink to="/examples">Examples</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{example.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Stack direction="row" align="center" wrap="wrap" gap={3}>
          <Heading level={1}>{example.title}</Heading>
          <Tag variant="secondary">{exampleKindLabel[example.kind]}</Tag>
        </Stack>
        <Text size="lg" color="muted">
          {example.summary}
        </Text>
      </Container>

      <section
        aria-label={`${example.title} example`}
        className="site-example-canvas"
        data-kind={example.kind}
      >
        {children}
      </section>

      <Container className="site-example-details">
        <Section
          title="Built with"
          lead="Every Kozmos component the example imports. There is nothing else on the canvas."
        >
          <Stack direction="row" wrap="wrap" gap={2}>
            {components.map((name) => (
              <Tag key={name} variant="outline">
                {name}
              </Tag>
            ))}
          </Stack>
        </Section>

        {example.gaps.length > 0 ? (
          <Section
            title="Where Kozmos falls short"
            lead="What a product would draw here that Kozmos cannot express yet. Each is in the site's GAPS.md."
          >
            <List aria-label="Gaps this example found">
              {example.gaps.map((gap) => (
                <ListItem key={gap}>
                  <Text as="span">{gap}</Text>
                </ListItem>
              ))}
            </List>
          </Section>
        ) : null}

        <Section title="Source" lead="The example's own files, as they are.">
          <Tabs defaultValue={files[0]?.name}>
            <TabsList aria-label="Source files">
              {files.map((file) => (
                <TabsTrigger key={file.name} value={file.name}>
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {files.map((file) => (
              <TabsContent key={file.name} value={file.name}>
                <CodeBlock label={file.name} code={file.code} />
              </TabsContent>
            ))}
          </Tabs>
        </Section>
      </Container>
    </>
  );
}
