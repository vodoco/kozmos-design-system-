import { Outlet } from "react-router";
import { foundationsSection } from "../foundations/nav";
import { DocsShell } from "../site/DocsShell";

export default function DocsLayout() {
  return (
    <DocsShell section={foundationsSection}>
      <Outlet />
    </DocsShell>
  );
}
