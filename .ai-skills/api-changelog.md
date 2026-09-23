# Kozmos Design System - API Changelog

> **Purpose:** This document tracks all API changes, deprecations, and breaking changes across Kozmos versions. Use this as the source of truth for understanding what changed and when.

---

## Table of Contents

1. [Changelog Format](#changelog-format)
2. [Current Version (v3.x)](#current-version-v3x)
3. [Previous Versions](#previous-versions)
4. [Deprecation Schedule](#deprecation-schedule)
5. [Breaking Changes Summary](#breaking-changes-summary)
6. [Component API History](#component-api-history)
7. [Token Changes History](#token-changes-history)

---

## Changelog Format

Each entry follows this structure:

```markdown
### [Version] - YYYY-MM-DD

#### 💥 Breaking Changes

- **ComponentName**: Description of breaking change
  - Migration: How to update
  - Codemod: `npx @kozmos-ds/codemod <name>` (if available)

#### ⚠️ Deprecations

- **ComponentName.propName**: Deprecated in favor of X
  - Removal: vX.0.0
  - Migration: How to update

#### ✨ New Features

- **ComponentName**: New component added
- **ComponentName.propName**: New prop added

#### 🐛 Bug Fixes

- **ComponentName**: Description of fix

#### 📦 Dependencies

- Updated: package@version
- Removed: package
```

---

## Current Version (v3.x)

### [3.0.0] - 2026-03-01 (Planned)

> **Theme:** API Consistency & Compound Components

#### 💥 Breaking Changes

##### Components

| Component  | Change                                  | Migration                    | Codemod                    |
| ---------- | --------------------------------------- | ---------------------------- | -------------------------- |
| **Button** | `variant="primary"` → `variant="solid"` | Update prop value            | ✅ `button-variant-rename` |
| **Button** | `isLoading` → `loading`                 | Update prop name             | ✅ `boolean-prop-rename`   |
| **Button** | `isDisabled` → `disabled`               | Update prop name             | ✅ `boolean-prop-rename`   |
| **Button** | `leftIcon`/`rightIcon` removed          | Use `<Button.Icon>` compound | ⚠️ `compound-icons`        |
| **Input**  | `onChange(value)` → `onChange(event)`   | Update handler signature     | ❌ Manual                  |
| **Input**  | `isInvalid` → `invalid`                 | Update prop name             | ✅ `boolean-prop-rename`   |
| **Modal**  | `isOpen` → `open`                       | Update prop name             | ✅ `modal-controlled`      |
| **Modal**  | `onClose` → `onOpenChange`              | Update callback signature    | ✅ `modal-controlled`      |
| **Select** | Complete rewrite                        | See migration guide          | ❌ Manual                  |
| **Tabs**   | Now uses compound pattern               | Restructure JSX              | ⚠️ `tabs-compound`         |

##### Tokens

| Old Token               | New Token                     | Codemod              |
| ----------------------- | ----------------------------- | -------------------- |
| `color.brand.primary`   | `color.interactive.primary`   | ✅ `token-migration` |
| `color.brand.secondary` | `color.interactive.secondary` | ✅ `token-migration` |
| `space.xs`              | `space.100`                   | ✅ `token-migration` |
| `space.sm`              | `space.200`                   | ✅ `token-migration` |
| `space.md`              | `space.400`                   | ✅ `token-migration` |
| `space.lg`              | `space.600`                   | ✅ `token-migration` |
| `space.xl`              | `space.800`                   | ✅ `token-migration` |

##### Removed

| Item                   | Replacement               |
| ---------------------- | ------------------------- |
| `LegacyCard` component | `Card`                    |
| `Dropdown` component   | `Select`                  |
| `useTheme().colors`    | `useTheme().tokens.color` |

#### ⚠️ Deprecations

| Item                          | Deprecated | Removal | Replacement                   |
| ----------------------------- | ---------- | ------- | ----------------------------- |
| `Button` `size="small"`       | v3.0.0     | v4.0.0  | `size="sm"`                   |
| `Card` `elevation` prop       | v3.0.0     | v4.0.0  | `shadow` prop                 |
| `ThemeProvider` `colors` prop | v3.0.0     | v4.0.0  | `theme` prop with full config |

#### ✨ New Features

##### Components

- **Avatar**: New component for user images with fallback
- **AvatarGroup**: Display stacked avatars
- **Skeleton**: Loading placeholder component
- **Toast**: Notification toast system
- **Tooltip**: Accessible tooltip component

##### Props

- **Button**: `asChild` prop for composition
- **All components**: `className` prop for custom styling
- **All form components**: `id` prop auto-generation

##### Compound Components

- **Button.Icon**: Icon within button
- **Card.Header**, **Card.Body**, **Card.Footer**: Card sections
- **Modal.Trigger**, **Modal.Content**, **Modal.Close**: Modal parts
- **Tabs.List**, **Tabs.Tab**, **Tabs.Panel**: Tab parts

#### 📦 Dependencies

| Change  | Package                    | Version       |
| ------- | -------------------------- | ------------- |
| Updated | `class-variance-authority` | 0.8.0 → 1.0.0 |
| Added   | `@radix-ui/react-slot`     | 1.0.0         |
| Removed | `classnames`               | —             |

---

### [3.1.0] - 2026-04-01 (Planned)

#### ✨ New Features

- **Breadcrumb**: Navigation breadcrumb component
- **Pagination**: Page navigation component
- **DatePicker**: Date selection (Phase 2)

#### 🐛 Bug Fixes

- **Button**: Fixed focus ring not visible in high contrast mode
- **Input**: Fixed placeholder color in dark mode
- **Modal**: Fixed scroll lock on iOS Safari

---

## Previous Versions

### [2.5.0] - 2026-01-15

#### ✨ New Features

- **Badge**: New component for labels and counts
- **Divider**: Horizontal/vertical separator

#### 🐛 Bug Fixes

- **Select**: Fixed dropdown positioning near viewport edge
- **Checkbox**: Fixed indeterminate state animation

---

### [2.4.0] - 2025-12-01

#### ✨ New Features

- **Accordion**: Collapsible content sections
- **Drawer**: Slide-out panel component

#### ⚠️ Deprecations

- **Modal**: `size="fullscreen"` deprecated in favor of `Drawer`

---

### [2.0.0] - 2025-06-01

> **Theme:** Initial Stable Release

#### 💥 Breaking Changes

##### From v1.x

| Component     | Change                                            | Migration                 |
| ------------- | ------------------------------------------------- | ------------------------- |
| All           | Package renamed `@pointr/ui` → `@kozmos-ds/react` | Update imports            |
| ThemeProvider | Now required at app root                          | Wrap app in ThemeProvider |
| Button        | `type` prop → `variant` prop                      | Rename prop               |
| Input         | `onChangeText` → `onChange`                       | Rename prop               |

#### ✨ New Features

- Complete component library (40+ components)
- Design token system
- Dark mode support
- RTL support

---

### [1.0.0] - 2025-01-01

> Initial release (internal beta)

---

## Deprecation Schedule

### Active Deprecations

| Item                    | Deprecated In | Removal In | Status     |
| ----------------------- | ------------- | ---------- | ---------- |
| `Button` `isLoading`    | v2.5.0        | v3.0.0     | 🔴 Removed |
| `Button` `size="small"` | v3.0.0        | v4.0.0     | 🟡 Warning |
| `Card` `elevation`      | v3.0.0        | v4.0.0     | 🟡 Warning |
| `LegacyCard`            | v2.0.0        | v3.0.0     | 🔴 Removed |

### Deprecation Policy

1. **Announcement**: Deprecation noted in changelog and console warning
2. **Grace Period**: Minimum 2 minor versions before removal
3. **Warning**: Runtime console.warn in development builds
4. **Documentation**: Migration guide published
5. **Removal**: Breaking change in next major version

### Console Warning Format

```javascript
// Development only
console.warn(
  '[Kozmos] Button: "isLoading" prop is deprecated and will be removed in v3.0.0. ' +
    'Use "loading" instead. ' +
    "See: https://kozmos.pointr.design/migration/button#isloading",
);
```

---

## Breaking Changes Summary

### By Major Version

#### v3.0.0 Breaking Changes

| Category           | Count  | Codemod Coverage |
| ------------------ | ------ | ---------------- |
| Prop renames       | 12     | 100%             |
| Prop removals      | 4      | 75%              |
| Component removals | 2      | N/A              |
| Token renames      | 15     | 100%             |
| Behavioral changes | 3      | 0%               |
| **Total**          | **36** | **85%**          |

#### v2.0.0 Breaking Changes

| Category               | Count  | Codemod Coverage |
| ---------------------- | ------ | ---------------- |
| Package rename         | 1      | 100%             |
| Prop renames           | 8      | 100%             |
| Component restructures | 2      | 50%              |
| **Total**              | **11** | **90%**          |

---

## Component API History

### Button

| Version | Props Added                                     | Props Changed                                      | Props Removed           |
| ------- | ----------------------------------------------- | -------------------------------------------------- | ----------------------- |
| v1.0.0  | `type`, `size`, `disabled`, `onClick`           | —                                                  | —                       |
| v2.0.0  | `variant`, `leftIcon`, `rightIcon`, `isLoading` | `type` → `variant`                                 | —                       |
| v2.5.0  | `isDisabled`                                    | —                                                  | —                       |
| v3.0.0  | `loading`, `asChild`                            | `isLoading` → `loading`, `isDisabled` → `disabled` | `leftIcon`, `rightIcon` |

#### Current API (v3.x)

```typescript
interface ButtonProps {
  variant?: "solid" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}
```

### Input

| Version | Props Added                                     | Props Changed                                         | Props Removed |
| ------- | ----------------------------------------------- | ----------------------------------------------------- | ------------- |
| v1.0.0  | `value`, `onChangeText`, `placeholder`          | —                                                     | —             |
| v2.0.0  | `onChange`, `type`, `isInvalid`, `errorMessage` | `onChangeText` → `onChange`                           | —             |
| v3.0.0  | `invalid`                                       | `isInvalid` → `invalid`, `onChange` signature changed | —             |

#### Current API (v3.x)

```typescript
interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void; // Convenience callback
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  errorMessage?: string;
}
```

### Modal

| Version | Props Added                           | Props Changed                                 | Props Removed |
| ------- | ------------------------------------- | --------------------------------------------- | ------------- |
| v1.0.0  | `isOpen`, `onClose`, `children`       | —                                             | —             |
| v2.0.0  | `size`, `closeOnOverlayClick`         | —                                             | —             |
| v3.0.0  | `open`, `onOpenChange`, `defaultOpen` | `isOpen` → `open`, `onClose` → `onOpenChange` | —             |

#### Current API (v3.x)

```typescript
// Controlled
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Uncontrolled
interface ModalProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
}

// Compound components
Modal.Trigger: React.FC<{ asChild?: boolean; children: React.ReactNode }>
Modal.Content: React.FC<{ children: React.ReactNode }>
Modal.Close: React.FC<{ asChild?: boolean; children: React.ReactNode }>
Modal.Title: React.FC<{ children: React.ReactNode }>
Modal.Description: React.FC<{ children: React.ReactNode }>
```

---

## Token Changes History

### Color Tokens

| Version | Added                                                | Renamed                                 | Removed                            |
| ------- | ---------------------------------------------------- | --------------------------------------- | ---------------------------------- |
| v1.0.0  | `color.primary`, `color.secondary`                   | —                                       | —                                  |
| v2.0.0  | `color.brand.*`, `color.neutral.*`, `color.status.*` | —                                       | `color.primary`, `color.secondary` |
| v3.0.0  | `color.interactive.*`                                | `color.brand.*` → `color.interactive.*` | —                                  |

### Spacing Tokens

| Version | Token System                                                                               |
| ------- | ------------------------------------------------------------------------------------------ |
| v1.0.0  | `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`, `spacing.xl`                       |
| v2.0.0  | `space.xs`, `space.sm`, `space.md`, `space.lg`, `space.xl`, `space.2xl`                    |
| v3.0.0  | `space.100`, `space.200`, `space.300`, `space.400`, `space.600`, `space.800`, `space.1000` |

### Token Value Changes

| Token (v3.x) | v2.x Value                  | v3.x Value                   | Reason                    |
| ------------ | --------------------------- | ---------------------------- | ------------------------- |
| `space.400`  | 16px                        | 16px                         | No change                 |
| `radius.200` | 6px                         | 8px                          | Increased for modern look |
| `shadow.200` | `0 2px 4px rgba(0,0,0,0.1)` | `0 2px 8px rgba(0,0,0,0.08)` | Softer shadows            |

---

## API Stability Indicators

### Component Stability

| Status            | Meaning                          | API Changes                                 |
| ----------------- | -------------------------------- | ------------------------------------------- |
| 🟢 **Stable**     | Production ready                 | Breaking changes only in major versions     |
| 🟡 **Beta**       | Feature complete, API may change | May have breaking changes in minor versions |
| 🔴 **Alpha**      | Experimental                     | Expect breaking changes                     |
| ⚫ **Deprecated** | Will be removed                  | Use replacement                             |

### Current Component Status

| Component  | Status        | Since  |
| ---------- | ------------- | ------ |
| Button     | 🟢 Stable     | v2.0.0 |
| Input      | 🟢 Stable     | v2.0.0 |
| Select     | 🟢 Stable     | v3.0.0 |
| Modal      | 🟢 Stable     | v3.0.0 |
| Toast      | 🟡 Beta       | v3.0.0 |
| DatePicker | 🔴 Alpha      | v3.1.0 |
| LegacyCard | ⚫ Deprecated | v2.0.0 |

---

## Subscribing to Changes

### Release Notifications

```bash
# Watch releases on GitHub
gh repo watch AcmeCorp/kozmos --web

# Subscribe to changelog RSS
https://github.com/AcmeCorp/kozmos/releases.atom
```

### Changelog in Code

```typescript
// Check version programmatically
import { version, changelog } from "@kozmos-ds/react";

console.log(version); // "3.0.0"
console.log(changelog.breaking); // Array of breaking changes
```

---

## Version History

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0.0   | 2026-02-07 | Initial API changelog |

---

**Maintainer:** Kozmos Design System Core Team
**Last Updated:** 2026-02-07
