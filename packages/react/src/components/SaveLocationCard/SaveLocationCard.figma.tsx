import figma from "@figma/code-connect";
import { SaveLocationCard } from "./SaveLocationCard";

const saveLocationCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8338";

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
