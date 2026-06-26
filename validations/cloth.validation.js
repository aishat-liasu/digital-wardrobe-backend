import { z } from "zod";

export const createClothSchema = z.object({
  name: z.string().min(1, { message: "Cloth name is required" }),
  clothTypeId: z.union([
    z.string().regex(/^\d+$/, "Must be an integer string"),
    z.number().int(),
  ]),
  colours: z.array(z.string()).optional(),
  comment: z.string().optional().nullable(),
  imageName: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  statusIds: z.array(z.union([
    z.string().regex(/^\d+$/, "Must be an integer string"),
    z.number().int(),
  ])).optional().default([]),
});

export const updateClothSchema = z.object({
  name: z.string().min(1, { message: "Cloth name is required" }).optional(),
  clothTypeId: z.union([
    z.string().regex(/^\d+$/, "Must be an integer string"),
    z.number().int(),
  ]).optional(),
  colours: z.array(z.string()).optional(),
  comment: z.string().optional().nullable(),
  imageName: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  statusIds: z.array(z.union([
    z.string().regex(/^\d+$/, "Must be an integer string"),
    z.number().int(),
  ])).optional(),
});
