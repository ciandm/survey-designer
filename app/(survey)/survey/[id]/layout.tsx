import React from 'react';
import {notFound} from 'next/navigation';
import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {sortChoices} from '@/utils/element';
import {getPublishedSurvey} from '../../_lib/get-published-survey';

type SurveyLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const SurveyLayout = async ({children, params}: SurveyLayoutProps) => {
  const survey = await getPublishedSurvey(params.id);

  if (!survey) {
    return notFound();
  }

  const model = sortChoices(survey.model);

  return (
    <SurveyShell className="min-h-screen">
      <SurveyShellAside model={model} className="md:h-screen" />
      <SurveyShellMain>{children}</SurveyShellMain>
    </SurveyShell>
  );
};

export default SurveyLayout;
