import { useEffect, useState } from "react";
import {
  Button,
  ScrollArea,
  Separator,
  Stack,
  Surface,
  Text,
} from "@kozmos/react";

type CopyStatus = "idle" | "copied" | "failed";

const statusText: Record<CopyStatus, string> = {
  idle: "",
  copied: "Copied",
  failed: "Copy failed",
};

/**
 * GAP-05: Kozmos has no code block. This composes one from Surface,
 * ScrollArea, Text and Button around a <pre>. The <pre> deliberately carries
 * no Kozmos class: the provider's scoped preflight gives an unclassed <pre>
 * the monospace family, and `kozmos-reset` would take it away again.
 */
export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Surface className="site-code">
      <Stack
        direction="row"
        align="center"
        justify="between"
        gap={2}
        className="site-code-bar"
      >
        <Text as="span" size="sm" color="muted">
          {label}
        </Text>
        <Stack direction="row" align="center" gap={2}>
          <Text as="span" size="sm" color="muted" aria-live="polite">
            {statusText[status]}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Copy ${label}`}
            onClick={copy}
          >
            Copy
          </Button>
        </Stack>
      </Stack>
      <Separator />
      <ScrollArea
        orientation="both"
        hideScrollbar={false}
        viewportProps={{
          role: "region",
          "aria-label": label,
          className: "site-code-body",
        }}
      >
        <Text as="div" size="sm">
          <pre className="site-code-pre">
            <code>{code.trimEnd()}</code>
          </pre>
        </Text>
      </ScrollArea>
    </Surface>
  );
}
