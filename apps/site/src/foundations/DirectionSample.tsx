import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Chip,
  ChipGroup,
  Icon,
  Stack,
  Stepper,
  Surface,
  Switch,
  ThemeProvider,
} from "@kozmos/react";

/** The same parts under a left-to-right and a right-to-left provider. */
export function DirectionSample({ compact = false }: { compact?: boolean }) {
  const [rtl, setRtl] = useState(false);
  return (
    <Stack gap={3}>
      <Switch label="Right to left" checked={rtl} onCheckedChange={setRtl} />
      <ThemeProvider dir={rtl ? "rtl" : "ltr"}>
        <Surface className="site-theme-sample">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#main">Venues</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#main">Riverside Centre</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bookshop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {compact ? null : (
            <Stepper
              steps={["Search", "Choose", "Route", "Arrive"]}
              currentStep={2}
            />
          )}
          <ChipGroup aria-label="Filters">
            <Chip size="sm" selected icon={<Icon name="check" />}>
              Open now
            </Chip>
            <Chip size="sm">Step-free</Chip>
          </ChipGroup>
          <Stack direction="row" gap={2}>
            <Button size={compact ? "sm" : "default"}>
              <Icon name="arrow-left" size="sm" />
              Back
            </Button>
            <Button size={compact ? "sm" : "default"} variant="outline">
              Next
              <Icon name="arrow-right" size="sm" />
            </Button>
          </Stack>
        </Surface>
      </ThemeProvider>
    </Stack>
  );
}
