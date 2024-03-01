import React from 'react';
import {ConfigPanel} from './config-panel';
import {ElementsDndContext} from './elements-dnd-context';
import {ElementsList} from './elements-list';
import {ElementsToolbar} from './elements-tool-bar';
import {TitleEditor} from './title-editor';

export const Designer = () => {
  return (
    <div className="flex w-full flex-1 items-stretch">
      <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-44 shrink-0 bg-muted lg:block">
        <ElementsToolbar />
      </aside>
      <section className="flex flex-1 flex-col bg-accent px-4 pb-6 sm:pl-2 sm:pr-4">
        <TitleEditor />
        <div className="flex w-full flex-col gap-4">
          <ElementsDndContext>
            <ElementsList />
          </ElementsDndContext>
        </div>
      </section>
      <aside className="sticky bottom-0 top-14 hidden h-[calc(100vh-56px)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l p-4 lg:block">
        <ConfigPanel />
      </aside>
    </div>
  );
};
