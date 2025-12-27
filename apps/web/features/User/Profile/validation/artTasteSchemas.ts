import { z } from "zod";

export const artTasteValidationMessages = {
    selectionRequired: "Profile.ArtTaste.validation.selection-required",
    singleSelection: "Profile.ArtTaste.validation.single-selection",
};

export type ArtTasteFormValues = {
    choices: Record<string, boolean>;
};

export const buildArtTasteSchema = (multiple: boolean) =>
    z
        .object({
            choices: z.record(z.boolean()),
        })
        .superRefine((data, ctx) => {
            const selectedCount = Object.values(data.choices).filter(Boolean).length;
            if (selectedCount < 1) {
                ctx.addIssue({
                    code: "custom",
                    message: artTasteValidationMessages.selectionRequired,
                    path: ["choices"],
                });
            }
            if (!multiple && selectedCount > 1) {
                ctx.addIssue({
                    code: "custom",
                    message: artTasteValidationMessages.singleSelection,
                    path: ["choices"],
                });
            }
        });
