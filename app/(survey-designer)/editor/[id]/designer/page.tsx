import {Metadata} from 'next';
import {ConfigPanel} from '@/survey-designer/_components/config-panel';
import {ElementsDndContext} from '@/survey-designer/_components/elements-dnd-context';
import {ElementsList} from '@/survey-designer/_components/elements-list';
import {ElementsToolbar} from '@/survey-designer/_components/elements-tool-bar';
import {TitleEditor} from '@/survey-designer/_components/title-editor';

const DesignerPage = async () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="hidden max-w-[240px] flex-1 flex-col gap-2 self-baseline md:flex">
        <ElementsToolbar />
      </div>
      <section className="flex flex-1 flex-col overflow-auto bg-accent px-4 pb-6 sm:pl-2 sm:pr-4">
        <div className="flex flex-col items-start space-y-2 py-4 pr-12">
          <TitleEditor />
        </div>
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
