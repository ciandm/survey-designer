import {Metadata} from 'next';
import {ConfigPanel} from '@/survey-designer/_components/config-panel';
import {ElementsDndContext} from '@/survey-designer/_components/elements-dnd-context';
import {ElementsList} from '@/survey-designer/_components/elements-list';
import {ElementsToolbar} from '@/survey-designer/_components/elements-tool-bar';
import {TitleEditor} from '@/survey-designer/_components/title-editor';

const DesignerPage = async () => {
  return (
    <div className="flex w-full items-start">
      <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-44 shrink-0 bg-muted lg:block">
        <ElementsToolbar />
      </aside>
      <section className="flex flex-1 flex-col bg-accent px-4 pb-6 sm:pl-2 sm:pr-4">
        <div className="flex flex-col items-start space-y-2 py-4 pr-12">
          <TitleEditor />
        </div>
        <div className="flex w-full flex-col gap-4">
          <ElementsDndContext>
            <ElementsList />
          </ElementsDndContext>
        </div>
      </section>
      <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l p-4 sm:flex xl:block">
        <ConfigPanel />
      </aside>
    </div>
  );
};

export default DesignerPage;

export const metadata: Metadata = {
  title: 'Survey Editor',
  description: 'Survey Editor',
};
