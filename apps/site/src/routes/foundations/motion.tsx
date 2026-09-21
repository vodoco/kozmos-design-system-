import { Alert, AlertDescription, Text } from "@kozmos/react";
import { DocsPage, foundationMeta } from "../../foundations/DocsPage";
import { MotionRace } from "../../foundations/MotionRace";
import { TokenTable } from "../../foundations/parts";
import { foundationPage } from "../../foundations/nav";
import { tokensWithPrefix } from "../../lib/tokens";
import { Section } from "../../site/Section";

const page = foundationPage("motion");

export function meta() {
  return foundationMeta(page);
}

export default function Motion() {
  return (
    <DocsPage page={page}>
      <Section
        title="Durations and easings"
        lead="Three durations and two curves cover the system. Quick for state changes, standard for most movement, deliberate for entrances. Emphasised overshoots; standard settles."
      >
        <MotionRace />
      </Section>

      <Section
        title="The tokens"
        lead="Durations in milliseconds, entry and exit as a scale, slide distances in unitless pixels."
      >
        <TokenTable
          entries={tokensWithPrefix("--semantics-motion-")}
          caption="Motion tokens"
          labelPrefix="--semantics-motion"
        />
      </Section>

      <Section title="Reduced motion">
        <Alert variant="info" role="note">
          <AlertDescription>
            The components respect the system’s reduced-motion preference: the
            location marker’s pulse stops, reveals become cuts, and the design
            config’s{" "}
            <Text as="span" className="site-mono">
              motion: reduced
            </Text>{" "}
            does the same for a whole module. The duration scale token lets a
            product shorten or lengthen everything at once. This page’s race
            still runs under reduced motion, because it is the thing being
            demonstrated.
          </AlertDescription>
        </Alert>
      </Section>
    </DocsPage>
  );
}
