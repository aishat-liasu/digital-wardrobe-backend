import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(48).optional().default(12),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["ASC", "DESC", "asc", "desc"]).optional(),
}).passthrough();
