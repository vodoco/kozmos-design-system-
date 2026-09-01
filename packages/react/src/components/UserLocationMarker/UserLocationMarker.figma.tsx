import figma from "@figma/code-connect";
import { UserLocationMarker } from "./UserLocationMarker";

const userLocationMarkerUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8346";

figma.connect(UserLocationMarker, userLocationMarkerUrl, {
  props: {
    showHeading: figma.enum("Heading", {
      Hidden: false,
      Visible: true,
    }),
  },
  // heading is a bearing in degrees supplied by the location provider; it
  // rotates the cone rather than adding a variant.
  example: ({ showHeading }) => (
    <UserLocationMarker showHeading={showHeading} heading={deviceHeading} />
  ),
});
