'use client';

import {useState} from 'react';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useActiveElement} from '../../_hooks/use-active-element';
import {SurveySettings} from '../survey-settings/survey-settings';
import {Footer} from './footer';
import {QuestionEditor} from './question-editor';

export const ElementEditor = () => {
  const {activeElement, activeElementIndex} = useActiveElement();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="group flex flex-1 cursor-pointer flex-col shadow-sm ring-ring ring-offset-2 transition-colors">
        <div className="flex flex-1 flex-col gap-6 px-6 pb-2 pt-4">
          <QuestionEditor element={activeElement} index={activeElementIndex} />
        </div>
        <Footer
          element={activeElement}
          onSettingsClick={handleSettingsClick}
          index={activeElementIndex}
        />
      </div>
      <Drawer
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        direction="bottom"
        shouldScaleBackground={false}
      >
        <DrawerContent className="flex max-h-[90%] flex-col">
          <ScrollArea className="overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-lg">
              <SurveySettings />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};
