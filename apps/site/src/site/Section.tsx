import { useId, type ReactNode } from "react";
import { Heading, Text } from "@kozmos/react";

/** A titled section of a page: an h2, an optional lead, and its content. */
export function Section({
  title,
  lead,
  actions,
  level = 2,
  children,
}: {
  title: string;
  lead?: ReactNode;
  /** Controls beside the title: a switch, a filter. */
  actions?: ReactNode;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="site-section">
      <header className="site-section-header">
        <Heading
          level={level}
          id={headingId}
          className={level === 2 ? "site-headline" : undefined}
        >
          {title}
        </Heading>
        {lead ? <Text color="muted">{lead}</Text> : null}
        {actions}
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
      <Heading level={1} className="site-title">
        {title}
      </Heading>
      {lead ? (
        <Text size="lg" color="muted">
          {lead}
        </Text>
      ) : null}
      {children}
    </header>
  );
}
