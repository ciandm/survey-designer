'use client';

import Link from 'next/link';
import {QuestionField} from '@/components/question-field';
import {SurveyScreen} from '@/components/survey-screen';
import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
import {ThankYouScreen} from '@/components/thank-you-screen';
import {Button} from '@/components/ui/button';
import {WelcomeScreen} from '@/components/welcome-screen';
import {useSurvey} from '@/hooks/use-survey';
import {ParsedModelType} from '@/types/survey';

type LiveSurveyProps = {
  model: ParsedModelType;
};

export const LiveSurvey = ({model}: LiveSurveyProps) => {
  const {form, handlers, displayed, screen} = useSurvey({
    model,
    onSurveySubmit: ({data}) => {
      alert('TODO: submit survey data to server via action');
    },
  });

  return (
    <SurveyShell>
      <SurveyShellAside model={model} />
      <SurveyShellMain>
        {screen === 'welcome_screen' && (
          <WelcomeScreen message={model.screens.welcome.message}>
            <Button onClick={handlers.handleStartSurvey}>Start survey</Button>
          </WelcomeScreen>
        )}
        {screen === 'survey_screen' &&
          (displayed.element ? (
            <SurveyScreen methods={form} onSubmit={handlers.handleSubmit}>
              <QuestionField
                element={displayed.element}
                index={displayed.index}
                key={displayed.element?.id}
              />
              <Button type="submit">Next</Button>
            </SurveyScreen>
          ) : (
            <div className="space-y-4 text-center">
              <h1 className="text-5xl">😭</h1>
              <p className="text-muted-foreground">
                There are no questions in this survey yet.
              </p>
            </div>
          ))}
        {screen === 'thank_you_screen' && (
          <ThankYouScreen message={model.screens.thank_you.message}>
            <Button asChild>
              <Link href="/home">Home</Link>
            </Button>
          </ThankYouScreen>
        )}
      </SurveyShellMain>
    </SurveyShell>
  );
};
