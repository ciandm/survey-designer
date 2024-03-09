'use client';

import {QuestionField} from '@/components/question-field';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
import {SurveyScreen} from '@/components/survey-screen';
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
  const {form, handlers, currentElement, screen} = useSurvey({
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

  const {element, index} = currentElement;

  return (
    <>
      {model.elements.length === 0 ? (
        <div className="space-y-4 text-center">
          <h1 className="text-5xl">😭</h1>
          <p className="text-muted-foreground">
            There are no questions in this survey yet.
          </p>
        </div>
      ) : (
        <>
          {screen === 'welcome_screen' && (
            <WelcomeScreen message={model.screens.welcome.message}>
              <Button onClick={handlers.handleStartSurvey} size="lg">
                Start survey
              </Button>
            </WelcomeScreen>
          )}
          {screen === 'survey_screen' &&
            (element ? (
              <SurveyScreen methods={form} onSubmit={handlers.handleSubmit}>
                <SurveyFormButtons
                  currentElementId={element.id}
                  model={model}
                  onBack={handlers.handleGoBack}
                >
                  <QuestionField
                    element={element}
                    index={index}
                    key={element?.id}
                  />
                </SurveyFormButtons>
              </SurveyScreen>
            ) : (
              <div className="space-y-4 text-center">
                <h1 className="text-5xl">😭</h1>
                <p className="text-muted-foreground">
                  There are no questions in this survey yet.
                </p>
              </div>
            ))}
        </>
      )}
    </>
  );
};
