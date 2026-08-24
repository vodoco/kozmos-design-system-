import figma from "@figma/code-connect";
import { FileUpload } from "./FileUpload";

figma.connect(
  FileUpload,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=444-12724",
  {
    props: {
      disabled: figma.enum("State", {
        Default: false,
        Focus: false,
        Dragging: false,
        Disabled: true,
      }),
      status: figma.enum("Status", {
        Default: "default",
        Error: "error",
        Warning: "warning",
        Success: "success",
      }),
      multiple: figma.enum("Content", {
        Dropzone: false,
        Files: true,
      }),
      label: figma.string("Label Text"),
      browseLabel: figma.string("Browse Text"),
      dropLabel: figma.string("Drop Text"),
      emptyDescription: figma.string("Description Text"),
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({
      browseLabel,
      disabled,
      dropLabel,
      emptyDescription,
      helperText,
      label,
      multiple,
      status,
    }) => (
      <FileUpload
        accept=".jpg,.png,.pdf"
        browseLabel={browseLabel}
        disabled={disabled}
        dropLabel={dropLabel}
        emptyDescription={emptyDescription}
        helperText={helperText}
        label={label}
        maxSize={8 * 1024 * 1024}
        multiple={multiple}
        status={status}
      />
    ),
  },
);
