'use client';

import {getIsField, getIsScreen} from '@/utils/survey';
import {ActionBar} from '../action-bar';
import {ElementEditor} from '../element-editor';
import {FieldSettings} from '../field-settings';
import {ScreenSettings} from '../screen-settings';
import {SurveyContent} from '../survey-content';
import {useDesignerElement} from './hooks/use-designer-element';

export const Designer = () => {
  const {element, handleSetSelectedElement} = useDesignerElement();

  return (
    <div className="flex w-full flex-1 items-stretch">
      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[16rem] flex-grow border-r bg-white lg:block">
        <SurveyContent
          onSetSelectedElement={handleSetSelectedElement}
          element={element}
        />
      </aside>
      <main className="flex flex-1 flex-shrink-0 flex-col bg-accent">
        <ElementEditor element={element}>
          {getIsField(element) && (
            <ActionBar
              field={element}
              onSetSelectedElement={handleSetSelectedElement}
            />
          )}
        </ElementEditor>
      </main>
      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[18rem] flex-1 flex-col overflow-hidden border-l lg:flex">
        {getIsScreen(element) && (
          <ScreenSettings
            screen={element}
            onSetSelectedElement={handleSetSelectedElement}
          />
        )}
        {getIsField(element) && <FieldSettings field={element} />}
      </aside>
    </div>
  );
};
