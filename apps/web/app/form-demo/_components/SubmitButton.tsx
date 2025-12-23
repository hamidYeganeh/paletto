"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@repo/ui/Button";

type SubmitButtonProps = {
  label: string;
  loadingLabel?: string;
};

export function SubmitButton({ label, loadingLabel = "Submitting..." }: SubmitButtonProps) {
  const { formState } = useFormContext();

  return (
    <Button type="submit" isLoading={formState.isSubmitting} disabled={!formState.isValid}>
      {formState.isSubmitting ? loadingLabel : label}
    </Button>
  );
}
