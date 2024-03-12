import {z} from 'zod';
import {screenElementTypes, screenSchema} from '@/lib/validations/screen';
import {ParsedModelType} from './survey';

export type SurveyScreenKey = keyof ParsedModelType['screens'];

export type ScreenType = z.infer<typeof screenElementTypes>;
export type ScreenSchema = z.infer<typeof screenSchema>;
