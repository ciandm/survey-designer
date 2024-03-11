'use client';

import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ElementEditor} from '../element-editor/element-editor';
import {SurveyContent} from '../survey-content';
import {SurveySettings} from '../survey-settings/survey-settings';
import {DesignerHandlerProvider} from './designer.context';
import {useDesigner} from './use-designer';

export const Designer = () => {
  const {element, handlers, settings} = useDesigner();

  return (
    <>
      <DesignerHandlerProvider value={{...handlers}}>
        <div className="flex w-full flex-1 items-stretch">
          <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[20rem] flex-1 shrink-0 border-r bg-white lg:block">
            <SurveyContent element={element} />
          </aside>

          <main className="flex flex-1 flex-col bg-accent">
            <ElementEditor element={element} />
          </main>

          <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l lg:block">
            <SurveySettings element={element} />
          </aside>
        </div>
      </DesignerHandlerProvider>
      <Drawer
        open={settings.isOpen}
        onOpenChange={settings.setIsOpen}
        direction="bottom"
        shouldScaleBackground={false}
      >
        <DrawerContent className="flex max-h-[90%] flex-col">
          <ScrollArea className="overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-lg">
              <SurveySettings element={element} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};
