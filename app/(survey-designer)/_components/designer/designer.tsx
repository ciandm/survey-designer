'use client';

import {getIsField, getIsScreen} from '@/utils/survey';
import {ActionBar} from '../action-bar';
import {ElementEditor} from '../element-editor/element-editor';
import {FieldSettings} from '../field-settings/field-settings';
import {ScreenSettings} from '../screen-settings';
import {SurveyContent} from '../survey-content/survey-content';
import {useElementController} from './use-element-controller';

export const Designer = () => {
  const {element, handlers} = useElementController();

  return (
    <div className="flex w-full flex-1 items-stretch">
      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[20rem] flex-1 shrink-0 border-r bg-white lg:block">
        <SurveyContent
          element={element}
          onCreateField={handlers.handleCreateField}
          onDuplicateField={handlers.handleDuplicateField}
          onRemoveField={handlers.handleRemoveField}
          onCreateScreen={handlers.handleCreateScreen}
          onRemoveScreen={handlers.handleRemoveScreen}
          onSelectElement={handlers.handleSelectElement}
        />
      </aside>
      <main className="flex flex-1 flex-col bg-accent">
        <ElementEditor element={element}>
          {getIsField(element) && (
            <ActionBar
              field={element}
              onDuplicateField={handlers.handleDuplicateField}
              onRemoveField={handlers.handleRemoveField}
            />
          )}
        </ElementEditor>
      </main>
      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] w-full max-w-sm shrink-0 flex-col overflow-hidden border-l lg:flex">
        {getIsScreen(element) && (
          <ScreenSettings
            screen={element}
            onCreateField={handlers.handleCreateField}
          />
        )}
        {getIsField(element) && <FieldSettings field={element} />}
      </aside>
    </div>
  );
};
