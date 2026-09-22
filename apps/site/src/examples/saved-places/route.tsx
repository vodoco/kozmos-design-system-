import { pageTitle } from "../../lib/site";
import { ExamplePage } from "../../site/ExamplePage";
import { getExample } from "../manifest";
import SavedPlaces from "./SavedPlaces";
import styles from "./SavedPlaces.css?raw";
import source from "./SavedPlaces.tsx?raw";

const example = getExample("saved-places");

export function meta() {
  return [
    { title: pageTitle(example.title) },
    { name: "description", content: example.summary },
  ];
}

export default function SavedPlacesExample() {
  return (
    <ExamplePage
      example={example}
      files={[
        { name: "SavedPlaces.tsx", code: source },
        { name: "SavedPlaces.css", code: styles },
      ]}
    >
      <SavedPlaces />
    </ExamplePage>
  );
}
