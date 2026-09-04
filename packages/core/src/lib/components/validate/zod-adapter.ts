import type { ZodType } from 'zod';
import type { ValidationRule } from './validate.js';

/**
 * Zod adapter — converts a Zod schema into Intinya ValidationRule objects.
 *
 * Use this to keep validation consistent between server-side (superforms)
 * and client-side (standalone) validation.
 *
 * ```typescript
 * import { z } from 'zod';
 * import { zodRules } from '@intinyagroup/ui/validate';
 *
 * const schema = z.object({
 *   email: z.string().email('Email tidak valid'),
 *   password: z.string().min(8, 'Minimal 8 karakter')
 * });
 *
 * const validator = createFormValidator({
 *   email: zodRules(schema.shape.email),
 *   password: zodRules(schema.shape.password)
 * });
 * ```
 */

export function zodRules<T>(schema: ZodType<T>): ValidationRule[] {
  return [
    {
      validate: (value: unknown) => {
        const result = schema.safeParse(value);
        if (result.success) return null;

        // Extract first error message from ZodError
        const issues = result.error.issues;
        if (issues.length > 0) {
          return issues[0].message;
        }
        return 'Invalid value';
      }
    }
  ];
}

/**
 * Creates a full validator directly from a Zod schema.
 *
 * ```typescript
 * import { z } from 'zod';
 * import { createZodValidator } from '@intinyagroup/ui/validate';
 *
 * const validator = createZodValidator(
 *   z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8)
 *   })
 * );
 *
 * const result = validator.validate({ email: 'x', password: '123' });
 * // result.valid === false
 * // result.errors.email === 'Invalid email'
 * ```
 */
export function createZodValidator<T extends Record<string, unknown>>(
  schema: ZodType<T>
) {
  return {
    validate(values: T): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
      const result = schema.safeParse(values);
      if (result.success) return { valid: true, errors: {} };

      const errors: Partial<Record<keyof T, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof T;
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      }

      return { valid: false, errors };
    },

    validateField<K extends keyof T>(field: K, value: T[K]): string | null {
      // Get the shape from ZodObject
      const shape = (schema as unknown as { shape?: Record<string, ZodType> }).shape;
      const fieldSchema = shape?.[field as string];
      if (!fieldSchema) return null;

      const result = fieldSchema.safeParse(value);
      if (result.success) return null;
      return result.error.issues[0]?.message ?? 'Invalid value';
    }
  };
}
