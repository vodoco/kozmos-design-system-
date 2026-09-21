import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { examples } from "./examples/manifest";

export default [
  // One layout for every page, so the header stays mounted and focus can
  // move to the new content after each navigation.
  layout("routes/site-layout.tsx", [
    index("routes/home.tsx"),
    route("get-started", "routes/get-started.tsx"),
    route("examples", "routes/examples.tsx"),
    // Each example is its own route and chunk, pre-rendered like every page.
    ...examples.map((example) =>
      route(`examples/${example.slug}`, `examples/${example.slug}/route.tsx`),
    ),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
