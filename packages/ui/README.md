# @repo/ui

Shared React UI components for Paletto. Built with Tailwind CSS v4 and Radix UI primitives, plus internal utilities.

## Components
- `Button`
- `Checkbox`
- `DropdownMenu`
- `Form`: `ControlledInput`, `ControlledCheckbox`, `SubmitButton`
- `Highlight`
- `Input`
- `Progress` and `ProgressGroup`

## Dependencies
- Tailwind CSS utilities with `class-variance-authority`
- Radix UI primitives for checkbox, dropdown menu, and progress
- `@repo/hooks` for ripple effects
- `@repo/utils` for class merging
- `react-hook-form` for controlled form components
- `framer-motion` for animation helpers

## Usage
Each component is exported from its folder. Example:

```tsx
import { Button } from "@repo/ui/Button";
import { Input } from "@repo/ui/Input";

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="solid" color="primary">Save</Button>
      <Input name="email" label="Email" />
    </div>
  );
}
```

Form helpers with `react-hook-form`:

```tsx
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { useForm, FormProvider } from "react-hook-form";

const form = useForm();

<FormProvider {...form}>
  <ControlledInput control={form.control} name="email" label="Email" />
  <SubmitButton>Submit</SubmitButton>
</FormProvider>;
```

## Styling
- Component styles live alongside each component in `*Styles.ts`.
- Components expect Tailwind v4 to be available in the consuming app.
- Theme tokens are provided by `@repo/theme/theme.css`.

## Scripts
- `lint`: `eslint . --max-warnings 0`
- `generate:component`: `turbo gen react-component`
- `check-types`: `tsc --noEmit`
