import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {updateSurveyInput} from '@/lib/validations/survey';

export type SurveyFormState = Omit<z.infer<typeof updateSurveyInput>, 'id'>;

export type UseSurveyFormProps = {
  initialData?: Partial<SurveyFormState>;
};

export const useSurveyForm = ({initialData}: UseSurveyFormProps) => {
  return useForm<SurveyFormState>({
    resolver: zodResolver(updateSurveyInput),
    defaultValues: initialData,
  });
};

export type UseSurveyFormReturn = ReturnType<typeof useSurveyForm>;
