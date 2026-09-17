import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Input,
  Textarea,
  ThemeProvider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  DesignConfigProvider,
  buttonVariants,
  inputVariants,
  PasswordInput,
  NumberInput,
  MapControlButton,
} from "@kozmos/react";

function Controls({ id }: { id: string }) {
  return (
    <section data-testid={id} style={{ width: 300 }}>
      <Input
        label={`${id} name`}
        helperText="Helper text"
        data-testid={`${id}-input`}
      />
      <Input label={`${id} disabled`} disabled data-testid={`${id}-disabled`} />
      <Input
        label={`${id} invalid`}
        error="Invalid value"
        data-testid={`${id}-invalid`}
      />
      <Input
        label={`${id} warning`}
        status="warning"
        data-testid={`${id}-warning`}
      />
      <Input
        label={`${id} success`}
        status="success"
        data-testid={`${id}-success`}
      />
      <Input
        label={`${id} override`}
        className="consumer-control"
        data-testid={`${id}-override`}
      />
      <Input label={`${id} file`} type="file" data-testid={`${id}-file`} />
      <Textarea label={`${id} notes`} data-testid={`${id}-textarea`} />
      <Button data-testid={`${id}-button`}>Save</Button>
      <Button variant="outline" emotion="success" data-testid={`${id}-outline`}>
        Confirm
      </Button>
      <Button disabled data-testid={`${id}-disabled-button`}>
        Disabled
      </Button>
      <Button isLoading data-testid={`${id}-loading`}>
        Loading
      </Button>
      <Button variant="glass" data-testid={`${id}-glass`}>
        Glass
      </Button>
      <button
        className={buttonVariants({ size: "icon" })}
        data-testid={`${id}-helper-button`}
        aria-label={`${id} helper button`}
      >
        +
      </button>
      <input
        className={inputVariants({ status: "warning" })}
        data-testid={`${id}-helper-input`}
        aria-label={`${id} helper input`}
      />
      <PasswordInput label={`${id} password`} data-testid={`${id}-password`} />
      <NumberInput label={`${id} number`} data-testid={`${id}-number`} />
      <MapControlButton
        icon={<span aria-hidden="true">+</span>}
        label={`${id} map control`}
        emphasis="filled"
        pressed
        data-testid={`${id}-map-control`}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open {id}</Button>
        </PopoverTrigger>
        <PopoverContent data-testid={`${id}-popover`}>
          <Input
            label={`${id} portal input`}
            data-testid={`${id}-portal-input`}
          />
          <PopoverArrow data-testid={`${id}-arrow`} />
        </PopoverContent>
      </Popover>
      <div className="host-slot">
        <button className="host-slot-button">Host slot</button>
      </div>
    </section>
  );
}
function Fixture() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return (
    <>
      <button
        id="switch-theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Switch theme
      </button>
      <ThemeProvider theme={theme} dir="rtl">
        <DesignConfigProvider
          initialConfig={{ glass: { enabled: true, frost: 70 } }}
        >
          <Controls id="outer" />
          <ThemeProvider theme="light">
            <Controls id="nested" />
          </ThemeProvider>
        </DesignConfigProvider>
      </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("fixture")!).render(<Fixture />);
