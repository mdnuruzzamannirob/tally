import { z } from "zod";

const webEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().or(z.literal("")).default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_APP_URL: z.string().url().or(z.literal("")).default("http://localhost:3000"),
});

export const webEnv = webEnvironmentSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
});
