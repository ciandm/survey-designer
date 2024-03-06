'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
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
import {SurveyWithParsedModelType} from '@/types/survey';
import {saveResponsesAction} from '../_actions/save-responses-action';
import {transformResponsesMap} from '../_utils/response';

type LiveSurveyProps = {
  survey: SurveyWithParsedModelType;
};

export const LiveSurvey = ({survey}: LiveSurveyProps) => {
  const {id, model} = survey;
  const {form, handlers, isFirstElement, isLastElement, displayed, screen} =
    useSurvey({
      model,
      onSurveySubmit: async ({responses, handleSetScreen}) => {
        const transformedResponses = transformResponsesMap(responses);
        try {
          await saveResponsesAction({
            responses: transformedResponses,
            surveyId: id,
          });
          handleSetScreen('thank_you_screen');
        } catch (error) {
          alert('Failed to save survey responses');
        }
      },
    });

  return (
    <SurveyShell>
      <SurveyShellAside model={model} className="md:h-screen" />
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
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlers.handleGoBack}
                  variant="ghost"
                  size="sm"
                  disabled={isFirstElement}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLastElement ? 'Submit' : 'Next question'}
                  {isLastElement ? (
                    <CheckIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
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
