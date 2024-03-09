'use client';

import {useMemo, useRef} from 'react';
import {QuestionField} from '@/components/question-field';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
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
import {sortChoices} from '@/survey/_utils/question';
import {useSurveyModel} from '@/survey-designer/_store/survey-designer-store';
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

  const {element, index} = currentElement;

  return (
    <SurveyShell>
      <SurveyShellAside model={model} />
      <SurveyShellMain>
        {model.elements.length === 0 ? (
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
                    There are no questions in this survey yet. Add questions to
                    see a preview.
                  </p>
                  <Button onClick={() => setActiveTab('designer')}>
                    Add questions
                  </Button>
                </div>
              ))}
            {screen === 'thank_you_screen' && (
              <ThankYouScreen message={model.screens.thank_you.message}>
                <Button onClick={() => handlers.handleRestartSurvey()}>
                  Restart survey (preview mode only)
                </Button>
              </ThankYouScreen>
            )}
          </>
        )}
      </SurveyShellMain>
    </SurveyShell>
  );
};
