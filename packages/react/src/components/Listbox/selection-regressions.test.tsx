import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Listbox } from "./Listbox";
import { MultiSelect } from "../MultiSelect";
import { Combobox } from "../Combobox";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta", disabled: true },
  { value: "c", label: "Charlie" },
];

describe("selection regression contracts", () => {
  it("does not remove read-only selections with Backspace or open them with arrows", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        label="Tools"
        options={options}
        defaultValue={["a"]}
        readOnly
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Backspace}{ArrowDown}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it.each([MultiSelect, Combobox])(
    "names the input and popup and merges descriptions",
    async (Control) => {
      const user = userEvent.setup();
      render(
        <Control
          options={options}
          aria-label="Tools"
          aria-describedby="external"
          helperText="Owned help"
        />,
      );
      const input = screen.getByRole("combobox", { name: "Tools" });
      expect(input).toHaveAttribute(
        "aria-describedby",
        `external ${screen.getByText("Owned help").id}`,
      );
      await user.click(input);
      expect(
        screen.getByRole("listbox", { name: "Tools" }),
      ).toBeInTheDocument();
    },
  );

  it.each([MultiSelect, Combobox])(
    "closes its popup when keyboard focus leaves",
    async (Control) => {
      const user = userEvent.setup();
      render(
        <>
          <Control label="Tools" options={options} />
          <button>After field</button>
        </>,
      );
      await user.click(screen.getByRole("combobox"));
      fireEvent.blur(screen.getByRole("combobox"), {
        relatedTarget: screen.getByRole("button", { name: "After field" }),
      });
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    },
  );

  it("can close MultiSelect via its toggle after focus left the input", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect label="Tools" options={options} defaultValue={["a"]} />,
    );
    await user.click(screen.getByRole("combobox"));
    screen.getByRole("button", { name: "Remove Alpha" }).focus();
    await user.click(screen.getByRole("button", { name: "Close options" }));
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("does not point to disabled options when hovering Listbox", () => {
    render(<Listbox options={options} aria-label="Tools" />);
    const list = screen.getByRole("listbox");
    const before = list.getAttribute("aria-activedescendant");
    fireEvent.mouseEnter(screen.getByRole("option", { name: "Beta" }));
    expect(list).toHaveAttribute("aria-activedescendant", before);
  });

  it("keeps keyboard navigation on removable options at the selection limit", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        label="Tools"
        options={options}
        defaultValue={["c"]}
        maxSelected={1}
      />,
    );
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(
      document.getElementById(input.getAttribute("aria-activedescendant")!),
    ).toHaveAttribute("aria-selected", "true");
  });
});
