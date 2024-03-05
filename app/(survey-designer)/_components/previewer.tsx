'use client';

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
import {sortChoices} from '@/survey/_utils/question';
import {useSurveyModel} from '@/survey-designer/_store/survey-designer-store';
import {useDesignerTabManager} from './designer-tab-manager';

export const Previewer = () => {
  const model = sortChoices(useSurveyModel());
  const {setActiveTab} = useDesignerTabManager();

  const {form, handlers, displayed, screen} = useSurvey({
    model,
    onSurveySubmit: ({handleSetScreen}) => {
      handleSetScreen('thank_you_screen');
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
                There are no questions in this survey yet. Add questions to see
                a preview.
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
      </SurveyShellMain>
    </SurveyShell>
  );
};
