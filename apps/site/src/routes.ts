import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { examples } from "./examples/manifest";
import { foundationPages } from "./foundations/nav";

export default [
  // One layout for every plain page, so the header stays mounted and focus
  // can move to the new content after each navigation.
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
  // Reference pages sit beside a section sidebar.
  layout("routes/docs-layout.tsx", [
    route("foundations", "routes/foundations/index.tsx"),
    ...foundationPages.map((page) =>
      route(`foundations/${page.slug}`, `routes/foundations/${page.slug}.tsx`),
    ),
    route("components", "routes/components/index.tsx"),
    // One page per component, from the generated data; every slug is
    // pre-rendered (react-router.config.ts).
    route("components/:slug", "routes/components/component.tsx"),
  ]),
] satisfies RouteConfig;
