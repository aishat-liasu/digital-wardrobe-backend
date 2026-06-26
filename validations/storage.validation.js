import { z } from "zod";

export const presignedUrlSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z.string().min(1, { message: "File type is required" }),
  folder: z.string().optional(),
});
