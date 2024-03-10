import {ElementEditor} from './element-editor/element-editor';
import {SurveySettings} from './survey-settings/survey-settings';
import {SurveyContent} from './survey-content';

export const Designer = () => {
  return (
    <div className="flex w-full flex-1 items-stretch">
      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[20rem] flex-1 shrink-0 border-r bg-white lg:block">
        <SurveyContent />
      </aside>

      <main className="flex flex-1 flex-col bg-accent">
        <ElementEditor />
      </main>

      <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l p-4 lg:block">
        <SurveySettings />
      </aside>
    </div>
  );
};
