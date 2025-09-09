import { Resolver } from 'react-hook-form';
import { z } from 'zod/v4';

function toHookFormErrors(errors: z.ZodError<any>): Record<string, any> {
  return errors.issues.reduce<Record<string, any>>((acc, issue) => {
    if (!issue.path.length) return acc;

    const path = issue.path.join('.');
    acc[path] = {
      type: issue.code,
      message: issue.message,
    };

    return acc;
  }, {});
}

export function customResolver<TSchema extends z.ZodSchema<any>>(schema: TSchema): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    return {
      values: {},
      errors: toHookFormErrors(result.error),
    };
  };
}
