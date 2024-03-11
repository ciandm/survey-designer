import {Survey} from '@prisma/client';
import {z} from 'zod';
import {
  createSurveyInput,
  modelSchema,
  responseSchema,
  saveResponsesInput,
  updateModelInput,
} from '@/lib/validations/survey';
import type {ElementType} from './element';

export type UpdateSurveySchemaInputType = z.infer<typeof updateModelInput>;
export type CreateSurveyInputType = z.infer<typeof createSurveyInput>;
export type ResponseType = z.infer<typeof responseSchema>;
export type ParsedModelType = z.infer<typeof modelSchema>;

export type WithParsedModel<T> = T extends {model: any}
  ? {model: ParsedModelType} & Omit<T, 'model'>
  : never;

export type SurveyWithParsedModelType = WithParsedModel<Survey>;

export type SurveyScreen =
  | 'welcome_screen'
  | 'survey_screen'
  | 'thank_you_screen';

export type SurveyResponsesMap = {
  [questionId: string]: {
    value: string[];
    type: ElementType;
  };
};

export type SaveResponsesInput = z.infer<typeof saveResponsesInput>;

export type SurveyFormState = {
  questionId: string;
  value: string[];
  type: ElementType;
};

export type SurveyFormConfig = {
  [elementId: string]: {
    previous: string | null;
    next: string | 'complete';
  };
};
