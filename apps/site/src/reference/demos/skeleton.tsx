import { Box, Skeleton, Stack } from "@kozmos/react";
import type { DemoModule } from "../types";

function APlaceLoading() {
  return (
    <Box className="site-demo-column">
      <Stack direction="row" align="center" gap={3}>
        <Skeleton className="site-skeleton-disc" />
        <Stack gap={2} className="site-skeleton-lines">
          <Skeleton className="site-skeleton-line" />
          <Skeleton className="site-skeleton-line site-skeleton-line-short" />
        </Stack>
      </Stack>
      <Skeleton className="site-skeleton-block" />
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "A place, loading",
    description:
      "A pulsing muted surface in whatever shape the caller gives it; the shape is the caller's CSS.",
    Component: APlaceLoading,
  },
];
