'use client';

import {useState} from 'react';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ElementList} from './element-list';
import {QuickAddList} from './quick-add-list';
import {Settings} from './settings';
import {TitleEditor} from './title-editor';

export const Designer = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-1 items-stretch">
        <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-44 shrink-0 bg-muted lg:block">
          <QuickAddList />
        </aside>

        <main className="flex flex-1 flex-col bg-accent px-4 pb-6">
          <TitleEditor />
          <ElementList onSettingsClick={setIsSettingsOpen} />
        </main>

        <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l p-4 lg:block">
          <Settings />
        </aside>
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
              <Settings />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};
