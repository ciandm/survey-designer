'use client';

import {ErrorMessage} from '@hookform/error-message';
import {QuestionField} from '@/components/question-field';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
import {SurveyScreen} from '@/components/survey-screen';
import {ThankYouScreen} from '@/components/thank-you-screen';
import {TypeInputField} from '@/components/type-field';
import {Button} from '@/components/ui/button';
import {FormField} from '@/components/ui/form';
import {WelcomeScreen} from '@/components/welcome-screen';
import {useSurvey} from '@/hooks/use-survey';
import {useSurveyModel} from '../_hooks/use-survey-model';
import {useDesignerTabManager} from './designer-tab-manager';

export const Previewer = () => {
  const model = useSurveyModel();
  const {setActiveTab} = useDesignerTabManager();

  const {form, handlers, currentElement, screen} = useSurvey({
    model,
    isPreview: true,
  });

  const {
    screens: {welcome, thank_you},
  } = model;

  const {element, index} = currentElement;

  return (
    <div className="flex flex-1 bg-accent pt-40">
      <div className="mx-auto w-full max-w-xl px-4">
        {model.fields.length === 0 ? (
          <div className="mx-auto space-y-4 text-center">
            <h1 className="text-5xl">😭</h1>
            <p className="text-muted-foreground">
              There are no questions in this survey yet. Add questions to see a
              preview.
            </p>
            <Button onClick={() => setActiveTab('designer')}>
              Add questions
            </Button>
          </div>
        ) : (
          <>
            {screen === 'welcome_screen' && (
              <WelcomeScreen
                title={welcome[0].text}
                description={welcome[0].description}
              >
                <Button onClick={handlers.handleStartSurvey} size="lg">
                  {welcome[0].properties.button_label}
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
                        <QuestionField
                          field={element}
                          index={index}
                          key={element?.id}
                          isReadonly={false}
                        >
                          <div className="mb-2 mt-4">
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
                    There are no questions in this survey yet. Add questions to
                    see a preview.
                  </p>
                  <Button onClick={() => setActiveTab('designer')}>
                    Add questions
                  </Button>
                </div>
              ))}
            {screen === 'thank_you_screen' && (
              <ThankYouScreen
                title={thank_you[0].text}
                description={thank_you[0].description}
              >
                <Button onClick={() => handlers.handleRestartSurvey()}>
                  Restart survey (preview mode only)
                </Button>
              </ThankYouScreen>
            )}
          </>
        )}
      </div>
    </div>
  );
};
