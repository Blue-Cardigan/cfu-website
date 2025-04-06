import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PRINTFUL_API_KEY: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    PRINTFUL_API_KEY: process.env.PRINTFUL_API_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
}); 