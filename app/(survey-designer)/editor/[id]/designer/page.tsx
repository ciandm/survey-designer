import {Metadata} from 'next';
import {ConfigPanel} from '@/survey-designer/_components/config-panel';
import {ElementsDndContext} from '@/survey-designer/_components/elements-dnd-context';
import {ElementsList} from '@/survey-designer/_components/elements-list';
import {ElementsToolbar} from '@/survey-designer/_components/elements-tool-bar';
import {SurveyTitleEditor} from '@/survey-designer/_components/survey-title-editor';

const DesignerPage = async () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="hidden max-w-[240px] flex-1 flex-col gap-2 self-baseline md:flex">
        <ElementsToolbar />
      </div>
      <section className="flex flex-1 flex-col overflow-auto bg-accent px-4 pb-6 sm:pl-2 sm:pr-4">
        <SurveyTitleEditor />
        <div className="flex w-full flex-col gap-4">
          <ElementsDndContext>
            <ElementsList />
          </ElementsDndContext>
        </div>
      </section>
      <ConfigPanel />
    </div>
  );
};

export default DesignerPage;

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
