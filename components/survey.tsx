'use client';

import {ErrorMessage} from '@hookform/error-message';
import {ScreenElement} from '@/components/screen-element';
import {SurveyFormButtons} from '@/components/survey-form-buttons';
import {TypeInputField} from '@/components/type-field';
import {Button} from '@/components/ui/button';
import {Form, FormField} from '@/components/ui/form';
import {useSurvey} from '@/hooks/use-survey';
import {ParsedModelType} from '@/types/survey';
import {FieldElement} from './field-element';

type SurveyProps = {
  model: ParsedModelType;
  id: string;
  isPreview?: boolean;
};

export const Survey = ({model, id, isPreview = false}: SurveyProps) => {
  const {form, handlers, currentElement, screen} = useSurvey({
    model,
    id,
    isPreview,
  });

  const {
    screens: {welcome, thank_you},
  } = model;

  const {element, index} = currentElement;

  return (
    <Form {...form}>
      <form onSubmit={handlers.handleSubmit} className="flex flex-1 bg-accent">
        {model.fields.length === 0 ? (
          <div className="mx-auto space-y-4 text-center">
            <h1 className="text-5xl">😭</h1>
            <p className="text-muted-foreground">
              There are no questions in this survey yet. Add questions to see a
              preview.
            </p>
          </div>
        ) : (
          <>
            {screen === 'welcome_screen' && (
              <ScreenElement screen={welcome[0]}>
                <Button
                  onClick={handlers.handleStartSurvey}
                  size="lg"
                  className="mt-8"
                >
                  {welcome[0].properties.button_label}
                </Button>
              </ScreenElement>
            )}
            {screen === 'survey_screen' &&
              (element ? (
                <FormField
                  {...form}
                  name="value"
                  render={({field: formField}) => (
                    <FieldElement field={element} index={index}>
                      <SurveyFormButtons
                        currentElementId={element.id}
                        model={model}
                        onBack={handlers.handleGoBack}
                      >
                        <TypeInputField formField={formField} field={element} />
                        <ErrorMessage
                          name="value"
                          render={({message}) => (
                            <p className="mt-2 text-sm font-medium leading-5 text-red-500">
                              {message}
                            </p>
                          )}
                        />
                      </SurveyFormButtons>
                    </FieldElement>
                  )}
                />
              ) : (
                <div className="space-y-4 text-center">
                  <h1 className="text-5xl">😭</h1>
                  <p className="text-muted-foreground">
                    There are no questions in this survey yet.
                  </p>
                </div>
              ))}
            {screen === 'thank_you_screen' && (
              <ScreenElement screen={thank_you[0]} />
            )}
          </>
        )}
      </form>
    </Form>
  );
};
