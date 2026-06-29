import { z } from "zod";

export const createOutfitSchema = z.object({
  name: z.string().min(1, { message: "Outfit name is required" }),
  description: z.string(),
  occasionId: z.union([
    z.string().regex(/^\d+$/, "Must be an integer string"),
    z.number().int(),
  ]),
  isFavourite: z.boolean().optional().default(false),
  clothIds: z
    .array(z.string())
    .min(2, { message: "An outfit must have at least 2 items" })
    .max(5, { message: "An outfit cannot have more than 5 items" }),
  tagIds: z
    .array(
      z.union([
        z.string().regex(/^\d+$/, "Must be an integer string"),
        z.number().int(),
      ]),
    )
    .optional()
    .default([]),
  lastWornAt: z.string().datetime().optional().nullable(),
});

export const updateOutfitSchema = z.object({
  name: z.string().min(1, { message: "Outfit name is required" }).optional(),
  description: z.string().optional(),
  occasionId: z
    .union([
      z.string().regex(/^\d+$/, "Must be an integer string"),
      z.number().int(),
    ])
    .optional(),
  isFavourite: z.boolean().optional(),
  clothIds: z
    .array(z.string())
    .min(2, { message: "An outfit must have at least 2 items" })
    .max(5, { message: "An outfit cannot have more than 5 items" })
    .optional(),
  tagIds: z
    .array(
      z.union([
        z.string().regex(/^\d+$/, "Must be an integer string"),
        z.number().int(),
      ]),
    )
    .optional(),
  lastWornAt: z.string().datetime().optional().nullable(),
});
