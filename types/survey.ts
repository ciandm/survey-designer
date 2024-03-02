import {Survey} from '@prisma/client';
import {z} from 'zod';
import {
  createSurveyInput,
  modelSchema,
  responseSchema,
  updateModelInput,
} from '@/lib/validations/survey';

export type UpdateSurveySchemaInputType = z.infer<typeof updateModelInput>;
export type CreateSurveyInputType = z.infer<typeof createSurveyInput>;
export type ResponseType = z.infer<typeof responseSchema>;
export type ParsedModelType = z.infer<typeof modelSchema>;

export type WithParsedModel<T> = T extends {model: any}
  ? {model: ParsedModelType} & Omit<T, 'model'>
  : never;

export type SurveyWithParsedModelType = WithParsedModel<Survey>;
