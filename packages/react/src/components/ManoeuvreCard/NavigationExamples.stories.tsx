import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AdaptiveMapShell } from "../AdaptiveMapShell";
import { Button } from "../Button";
import { Itinerary, type ItineraryStep } from "../Itinerary";
import { ManoeuvreCard } from "./ManoeuvreCard";
import { RouteProgressRail } from "../RouteProgressRail";
import { RouteSummary } from "../RouteSummary";
import type { DirectionType } from "../DirectionStep/DirectionStep";

/** A route as the products present one: the engine's words, metres, seconds. */
const route = {
  origin: "Dunkin'",
  destination: "Airport Shuttles",
  steps: [
    {
      id: "1",
      instruction: "Take Elevator down to First Floor",
      type: "straight",
      metres: 58,
      seconds: 60,
      floor: "Second Floor",
    },
    {
      id: "2",
      instruction: "Take Corridor to Garage B",
      type: "straight",
      metres: 71,
      seconds: 70,
      floor: "First Floor",
    },
    {
      id: "3",
      instruction: "Take Walkway to Terminal B",
      type: "right",
      metres: 40,
      seconds: 45,
      floor: "First Floor",
    },
    {
      id: "4",
      instruction: "Destination",
      type: "destination",
      metres: 32,
      seconds: 30,
      floor: "First Floor",
    },
  ] as const satisfies readonly {
    id: string;
    instruction: string;
    type: DirectionType;
    metres: number;
    seconds: number;
    floor: string;
  }[],
};

function minutes(seconds: number) {
  const value = Math.ceil(seconds / 60);
  return value <= 1 ? "1 min" : `${value} min`;
}

/**
 * The navigation screen: the manoeuvre card in the shell's top slot, opening
 * into the itinerary; the navigation summary with the rail in the panel over
 * Previous and Next step. The same composition as the Pointr QA app on iOS.
 */
function NavigationExample() {
  const [index, setIndex] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const step = route.steps[index];
  const total = route.steps.reduce((sum, s) => sum + s.metres, 0);
  const rest = route.steps.slice(index);
  const remainingMetres = rest.reduce((sum, s) => sum + s.metres, 0);
  const remainingSeconds = rest.reduce((sum, s) => sum + s.seconds, 0);
  const steps: ItineraryStep[] = route.steps.map((s, i) => ({
    id: s.id,
    instruction: s.instruction,
    type: s.type,
    current: i === index,
  }));
  const last = index === route.steps.length - 1;
  return (
    <AdaptiveMapShell
      className="h-[720px]"
      mapLabel="Example map"
      map={<div className="h-full w-full bg-muted/40" />}
      panelLabel="Directions"
      topBar={
        <ManoeuvreCard
          type={step.type}
          instruction={step.instruction}
          detail={`${step.metres} m · ${step.floor}`}
          expanded={expanded}
          onToggle={() => setExpanded((open) => !open)}
        >
          <Itinerary
            origin={route.origin}
            steps={steps}
            destination={route.destination}
          />
        </ManoeuvreCard>
      }
      panel={
        <div className="flex flex-col gap-4 p-4">
          <RouteSummary
            destination={route.destination}
            durationText={minutes(remainingSeconds)}
            distanceText={`${remainingMetres} m`}
            arrivalText="Arrive 12:58"
            onEndRoute={() => setIndex(0)}
            progress={
              <RouteProgressRail
                progress={(total - remainingMetres) / total}
                type={step.type}
                label={`Step ${index + 1} of ${route.steps.length}`}
              />
            }
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            >
              Previous step
            </Button>
            <Button
              className="flex-1"
              onClick={() => (last ? setIndex(0) : setIndex((i) => i + 1))}
            >
              {last ? "Finish" : "Next step"}
            </Button>
          </div>
        </div>
      }
    />
  );
}

const meta = {
  title: "Examples/Navigation",
  component: NavigationExample,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NavigationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Directions: Story = {};
