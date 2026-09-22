import "./SavedPlaces.css";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Heading,
  Icon,
  IconButton,
  SaveLocationCard,
  SearchBar,
  Stack,
  Tag,
  Text,
  Textarea,
  Tree,
  type TreeItem,
} from "@kozmos/react";

interface Saved {
  id: string;
  name: string;
  venue: string;
  floor: string;
  note?: string;
}

const initial: readonly Saved[] = [
  {
    id: "books",
    name: "Bookshop",
    venue: "Riverside Centre",
    floor: "First floor",
    note: "Author talk on Thursday",
  },
  {
    id: "info",
    name: "Information desk",
    venue: "Riverside Centre",
    floor: "Ground floor",
  },
  {
    id: "terrace",
    name: "Rooftop terrace",
    venue: "Riverside Centre",
    floor: "Second floor",
  },
  {
    id: "gate-b12",
    name: "Gate B12",
    venue: "Harbour Terminal",
    floor: "Departures",
  },
  {
    id: "lounge",
    name: "Quiet lounge",
    venue: "Harbour Terminal",
    floor: "Departures",
    note: "Power sockets by the window",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    venue: "King's Hospital",
    floor: "Ground floor",
  },
];

export default function SavedPlaces() {
  const [saved, setSaved] = useState<readonly Saved[]>(initial);
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState<Saved>();
  const [undo, setUndo] = useState<Saved>();
  const [car, setCar] = useState<{ note: string } | undefined>({
    note: "Level P2, bay 42",
  });
  const [editingCar, setEditingCar] = useState(false);
  const [carDraft, setCarDraft] = useState("");
  const [status, setStatus] = useState<string>();

  const shown = saved.filter((place) =>
    `${place.name} ${place.venue}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const venues = [...new Set(shown.map((place) => place.venue))];

  const tree: TreeItem[] = venues.map((venue) => ({
    id: venue,
    name: venue,
    children: shown
      .filter((place) => place.venue === venue)
      .map((place) => ({ id: place.id, name: place.name })),
  }));

  function remove(place: Saved) {
    setSaved((list) => list.filter((entry) => entry.id !== place.id));
    setUndo(place);
    setRemoving(undefined);
    setStatus(undefined);
  }

  function restore() {
    if (!undo) return;
    setSaved((list) => [...list, undo]);
    setUndo(undefined);
  }

  const byId = (id: string) => saved.find((place) => place.id === id);

  return (
    <Box className="ex-saved">
      <Stack gap={6}>
        <Stack gap={1}>
          <Heading level={2}>Saved places</Heading>
          <Text color="muted">
            {saved.length === 1 ? "1 place" : `${saved.length} places`} across{" "}
            {new Set(saved.map((place) => place.venue)).size} venues, and where
            the car is.
          </Text>
        </Stack>

        <SaveLocationCard
          title="My car"
          description={car ? car.note : "Remember where you parked"}
          isSaved={Boolean(car)}
          onSaveToggle={() => {
            if (car) {
              setCar(undefined);
              setStatus("The car's spot is forgotten.");
            } else {
              setCar({ note: "Level P2, bay 42" });
              setStatus("The car's spot is saved.");
            }
          }}
          onRouteToLocation={() =>
            setStatus("Routing to the car is the Wayfinding example's job.")
          }
          onEditNote={() => {
            setCarDraft(car?.note ?? "");
            setEditingCar(true);
          }}
        />

        {status ? (
          <Text size="sm" color="muted" role="status">
            {status}
          </Text>
        ) : null}

        {undo ? (
          // A toast would leave the page (GAPS.md, GAP-36); the undo stays
          // inline, as a status (Alert is always role="alert", GAP-12).
          <Alert variant="success" role="status">
            <AlertDescription>
              <Stack
                direction="row"
                align="center"
                justify="between"
                wrap="wrap"
                gap={2}
              >
                <Text as="span" size="sm">
                  {undo.name} is no longer saved.
                </Text>
                <Button variant="link" size="sm" onClick={restore}>
                  Undo
                </Button>
              </Stack>
            </AlertDescription>
          </Alert>
        ) : null}

        <SearchBar
          variant="inline"
          aria-label="Search saved places"
          placeholder="Search saved places"
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />

        {shown.length === 0 ? (
          <EmptyState
            icon={<Icon name="heart" size="xl" />}
            title={
              query.trim() ? "No saved place matches" : "Nothing saved yet"
            }
            description={
              query.trim()
                ? "Try another word."
                : "Save a place from its details and it appears here, by venue."
            }
            action={
              query.trim() ? (
                <Button variant="outline" onClick={() => setQuery("")}>
                  Clear the search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Tree
            ariaLabel="Saved places by venue"
            data={tree}
            defaultExpandedIds={venues}
            renderIcon={({ hasChildren }) => (
              <Icon
                name={hasChildren ? "building-01" : "marker-pin-01"}
                size="sm"
              />
            )}
            renderMeta={({ item, hasChildren }) => {
              if (hasChildren) {
                const count = item.children?.length ?? 0;
                return (
                  <Text as="span" size="xs" color="muted">
                    {count === 1 ? "1 place" : `${count} places`}
                  </Text>
                );
              }
              const place = byId(item.id);
              return place ? (
                <Stack direction="row" align="center" gap={2}>
                  <Tag variant="outline">{place.floor}</Tag>
                  {place.note ? (
                    <Text as="span" size="xs" color="muted">
                      {place.note}
                    </Text>
                  ) : null}
                </Stack>
              ) : null;
            }}
            renderActions={({ item, hasChildren }) => {
              if (hasChildren) return null;
              const place = byId(item.id);
              return place ? (
                <IconButton
                  aria-label={`Remove ${place.name} from saved places`}
                  size="sm"
                  onClick={() => setRemoving(place)}
                >
                  <Icon name="x-close" size="sm" />
                </IconButton>
              ) : null;
            }}
          />
        )}
      </Stack>

      <Dialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open) setRemoving(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {removing?.name}?</DialogTitle>
            <DialogDescription>
              It leaves your saved places; you can undo it straight after.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep it</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (removing) remove(removing);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingCar} onOpenChange={setEditingCar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where is the car?</DialogTitle>
            <DialogDescription>
              A level, a bay, a landmark — whatever will find it later.
            </DialogDescription>
          </DialogHeader>
          <form
            className="ex-saved-form"
            onSubmit={(event) => {
              event.preventDefault();
              setCar({ note: carDraft.trim() || "Remember where you parked" });
              setEditingCar(false);
              setStatus("The note is saved.");
            }}
          >
            <Textarea
              label="Note"
              rows={2}
              value={carDraft}
              onChange={(event) => setCarDraft(event.target.value)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingCar(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save the note</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
