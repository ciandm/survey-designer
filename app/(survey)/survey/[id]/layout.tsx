import React from 'react';
import {notFound} from 'next/navigation';
import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {sortChoices} from '@/survey/_utils/question';
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
    <SurveyShell>
      <SurveyShellAside model={model} className="md:h-screen" />
      <SurveyShellMain>{children}</SurveyShellMain>
    </SurveyShell>
  );
};

export default SurveyLayout;
