'use client';

import {ErrorMessage} from '@hookform/error-message';
import {useRouter} from 'next/navigation';
import {QuestionField} from '@/components/question-field';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
import {SurveyScreen} from '@/components/survey-screen';
import {TypeInputField} from '@/components/type-field';
import {Button} from '@/components/ui/button';
import {FormField} from '@/components/ui/form';
import {WelcomeScreen} from '@/components/welcome-screen';
import {useSurvey} from '@/hooks/use-survey';
import {SurveyWithParsedModelType} from '@/types/survey';
import {getSiteUrl} from '@/utils/hrefs';
import {transformResponsesMap} from '@/utils/survey';
import {saveResponsesAction} from '../_actions/save-responses-action';

type LiveSurveyProps = {
  survey: SurveyWithParsedModelType;
};

export const LiveSurvey = ({survey}: LiveSurveyProps) => {
  const {id, model} = survey;
  const router = useRouter();
  const {form, handlers, currentElement, screen} = useSurvey({
    model,
    onSurveySubmit: async ({responses}) => {
      const transformedResponses = transformResponsesMap(responses);
      try {
        router.prefetch(getSiteUrl.completePage({surveyId: id}));
        await saveResponsesAction({
          responses: transformedResponses,
          surveyId: id,
        });
        router.push(getSiteUrl.completePage({surveyId: id}));
      } catch (error) {
        alert('Failed to save survey responses');
      }
    },
  });

  const {element, index} = currentElement;

  return (
    <>
      {model.fields.length === 0 ? (
        <div className="space-y-4 text-center">
          <h1 className="text-5xl">😭</h1>
          <p className="text-muted-foreground">
            There are no questions in this survey yet.
          </p>
        </div>
      ) : (
        <>
          {screen === 'welcome_screen' && (
            <WelcomeScreen title={model.screens.welcome[0].text}>
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
                  <FormField
                    {...form}
                    name="value"
                    render={({field: formField}) => (
                      <QuestionField field={element} index={index}>
                        <div className="mt-4">
                          <TypeInputField
                            formField={formField}
                            field={element}
                          />
                        </div>
                        <ErrorMessage
                          name="value"
                          render={({message}) => (
                            <p className="text-sm font-medium leading-5 text-red-500">
                              {message}
                            </p>
                          )}
                        />
                      </QuestionField>
                    )}
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
