'use client';

import {UseFormReturn} from 'react-hook-form';
import {Form} from '@/components/ui';
import {SurveyFormState} from '@/types/survey';

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
      <form onSubmit={onSubmit} className="w-full flex-1">
        {children}
      </form>
    </Form>
  );
};
