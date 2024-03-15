import React from 'react';
import {notFound} from 'next/navigation';
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

  return <div className="flex min-h-screen">{children}</div>;
};

export default SurveyLayout;
