import { pageTitle } from "../../lib/site";
import { ExamplePage } from "../../site/ExamplePage";
import { getExample } from "../manifest";
import Booking from "./Booking";
import styles from "./Booking.css?raw";
import source from "./Booking.tsx?raw";

const example = getExample("booking");

export function meta() {
  return [
    { title: pageTitle(example.title) },
    { name: "description", content: example.summary },
  ];
}

export default function BookingExample() {
  return (
    <ExamplePage
      example={example}
      files={[
        { name: "Booking.tsx", code: source },
        { name: "Booking.css", code: styles },
      ]}
    >
      <Booking />
    </ExamplePage>
  );
}
