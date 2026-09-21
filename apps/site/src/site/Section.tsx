import { useId, type ReactNode } from "react";
import { Heading, Text } from "@kozmos/react";

/** A titled section of a page: an h2, an optional lead, and its content. */
export function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="site-section">
      <header className="site-section-header">
        <Heading level={2} id={headingId}>
          {title}
        </Heading>
        {lead ? <Text color="muted">{lead}</Text> : null}
      </header>
      {children}
    </section>
  );
}

/** The top of a page: its h1 and a lead paragraph. */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="site-page-header">
      <Heading level={1}>{title}</Heading>
      {lead ? (
        <Text size="lg" color="muted">
          {lead}
        </Text>
      ) : null}
      {children}
    </header>
  );
}
