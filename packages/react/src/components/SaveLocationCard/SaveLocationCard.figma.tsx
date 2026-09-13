import figma from "@figma/code-connect";
import {
  SaveLocationCard,
  type SaveLocationCardProps,
} from "./SaveLocationCard";

const saveLocationCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8338";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const toggleSaved: NonNullable<SaveLocationCardProps["onSaveToggle"]>;
declare const routeToLocation: NonNullable<
  SaveLocationCardProps["onRouteToLocation"]
>;
declare const editNote: NonNullable<SaveLocationCardProps["onEditNote"]>;

figma.connect(SaveLocationCard, saveLocationCardUrl, {
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    isSaved: figma.enum("State", { Default: false, Saved: true }),
  },
  example: ({ title, description, isSaved }) => (
    <SaveLocationCard
      title={title}
      description={description}
      isSaved={isSaved}
      onSaveToggle={() => toggleSaved()}
      onRouteToLocation={() => routeToLocation()}
      onEditNote={() => editNote()}
    />
  ),
});
