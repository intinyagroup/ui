export type ValidationRule<T = unknown> = {
  validate: (value: T) => string | null; // returns error message or null
  message?: string;
};

export const validators = {
  required: (message = 'This field is required') => ({
    validate: (value: unknown) =>
      value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
        ? message : null
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: unknown) => {
      const str = String(value ?? '');
      return str.length < min ? (message ?? `Must be at least ${min} characters`) : null;
    }
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: unknown) => {
      const str = String(value ?? '');
      return str.length > max ? (message ?? `Must be at most ${max} characters`) : null;
    }
  }),

  email: (message = 'Please enter a valid email') => ({
    validate: (value: unknown) => {
      const str = String(value ?? '');
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) ? null : message;
    }
  }),

  url: (message = 'Please enter a valid URL') => ({
    validate: (value: unknown) => {
      try { new URL(String(value)); return null; }
      catch { return message; }
    }
  }),

  pattern: (regex: RegExp, message = 'Invalid format') => ({
    validate: (value: unknown) => regex.test(String(value ?? '')) ? null : message
  }),

  min: (min: number, message?: string) => ({
    validate: (value: unknown) => {
      const num = Number(value);
      return isNaN(num) || num < min ? (message ?? `Must be at least ${min}`) : null;
    }
  }),

  max: (max: number, message?: string) => ({
    validate: (value: unknown) => {
      const num = Number(value);
      return isNaN(num) || num > max ? (message ?? `Must be at most ${max}`) : null;
    }
  }),

  minValue: (min: number, message?: string) => ({
    validate: (value: unknown) => {
      const num = Number(value);
      return isNaN(num) || num < min ? (message ?? `Must be greater than ${min}`) : null;
    }
  }),

  match: (matchValue: string, message = 'Values do not match') => ({
    validate: (value: unknown) => String(value) === matchValue ? null : message
  }),

  phone: (message = 'Please enter a valid phone number') => ({
    validate: (value: unknown) => {
      const str = String(value ?? '').replace(/[\s()-]/g, '');
      return /^[+]?[\d]{8,15}$/.test(str) ? null : message;
    }
  }),

  numeric: (message = 'Must be a number') => ({
    validate: (value: unknown) => !isNaN(Number(value)) ? null : message
  }),
};

export function createFormValidator<T extends Record<string, unknown>>(
  schema: { [K in keyof T]: ValidationRule[] }
) {
  return {
    validate(values: T): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
      const errors: Partial<Record<keyof T, string>> = {};
      let valid = true;

      for (const [key, rules] of Object.entries(schema)) {
        for (const rule of rules) {
          const error = rule.validate(values[key]);
          if (error) {
            errors[key as keyof T] = error;
            valid = false;
            break;
          }
        }
      }

      return { valid, errors };
    },

    validateField<K extends keyof T>(field: K, value: T[K]): string | null {
      const rules = schema[field];
      if (!rules) return null;
      for (const rule of rules) {
        const error = rule.validate(value);
        if (error) return error;
      }
      return null;
    }
  };
}
