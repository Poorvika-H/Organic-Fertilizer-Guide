import { z } from 'zod';
import { insertCalculationSchema, crops, calculations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  crops: {
    list: {
      method: 'GET' as const,
      path: '/api/crops' as const,
      responses: {
        200: z.array(z.custom<typeof crops.$inferSelect>()),
      },
    },
  },
  calculations: {
    list: {
      method: 'GET' as const,
      path: '/api/calculations' as const,
      responses: {
        200: z.array(z.custom<typeof calculations.$inferSelect & { crop: typeof crops.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/calculations' as const,
      input: z.object({
        cropId: z.coerce.number(),
        fieldSize: z.coerce.number().min(0.1, "Field size must be at least 0.1 acres")
      }),
      responses: {
        201: z.custom<typeof calculations.$inferSelect & { crop: typeof crops.$inferSelect }>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CropsListResponse = z.infer<typeof api.crops.list.responses[200]>;
export type CalculationsListResponse = z.infer<typeof api.calculations.list.responses[200]>;
export type CreateCalculationInput = z.infer<typeof api.calculations.create.input>;
export type CreateCalculationResponse = z.infer<typeof api.calculations.create.responses[201]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
