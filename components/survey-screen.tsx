'use client';

import {UseFormReturn} from 'react-hook-form';
import {SurveyFormState} from 'hooks/use-survey-form';
import {Form} from '@/components/ui/form';

type SurveyScreenProps = {
  children: React.ReactNode;
  methods: UseFormReturn<SurveyFormState>;
  onSubmit: () => void;
};

export const SurveyScreen = ({
  children,
  methods,
  onSubmit,
}: SurveyScreenProps) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="w-full flex-1 space-y-12">
        {children}
      </form>
    </Form>
  );
};
