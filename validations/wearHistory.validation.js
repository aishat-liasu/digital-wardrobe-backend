import { z } from "zod";

export const createWearHistorySchema = z.object({
  outfitId: z.string().min(1, { message: "Outfit ID is required" }),
  dateWorn: z.string().date("Invalid date format, must be YYYY-MM-DD").optional().nullable(),
  note: z.string().optional().nullable(),
});

export const updateWearHistorySchema = z.object({
  dateWorn: z.string().date("Invalid date format, must be YYYY-MM-DD").optional().nullable(),
  note: z.string().optional().nullable(),
});
