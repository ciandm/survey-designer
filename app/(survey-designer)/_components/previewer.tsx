'use client';

import {useMemo} from 'react';
import {QuestionField} from '@/components/question-field';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
import {SurveyScreen} from '@/components/survey-screen';
import {ThankYouScreen} from '@/components/thank-you-screen';
import {Button} from '@/components/ui/button';
import {WelcomeScreen} from '@/components/welcome-screen';
import {useSurvey} from '@/hooks/use-survey';
import {useSurveyModel} from '@/survey-designer/_store/survey-designer-store';
import {sortChoices} from '@/utils/element';
import {useDesignerTabManager} from './designer-tab-manager';

export const Previewer = () => {
  const initialModel = useSurveyModel();
  const model = useMemo(() => sortChoices(initialModel), [initialModel]);
  const {setActiveTab} = useDesignerTabManager();

  const {form, handlers, currentElement, screen} = useSurvey({
    model,
    onSurveySubmit: ({handleSetScreen}) => {
      handleSetScreen('thank_you_screen');
    },
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
                    <QuestionField
                      field={element}
                      index={index}
                      key={element?.id}
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
