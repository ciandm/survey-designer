'use client';

import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {ScrollArea} from '@/components/ui/scroll-area';
import {getIsField, getIsScreen} from '@/utils/survey';
import {ActionBar} from '../action-bar';
import {ElementEditor} from '../element-editor/element-editor';
import {FieldSettings} from '../field-settings/field-settings';
import {ScreenSettings} from '../screen-settings';
import {SurveyContent} from '../survey-content/survey-content';
import {useDesigner} from './use-designer';

export const Designer = () => {
  const {element, handlers, settings} = useDesigner();

  return (
    <>
      <div className="flex w-full flex-1 items-stretch">
        <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] max-w-[20rem] flex-1 shrink-0 border-r bg-white lg:block">
          <SurveyContent
            element={element}
            handleSelectElement={handlers.handleSelectElement}
            handleCreateElement={handlers.handleCreateElement}
            handleCreateScreen={handlers.handleCreateScreen}
          />
        </aside>

        <main className="flex flex-1 flex-col bg-accent">
          <ElementEditor element={element}>
            {getIsField(element) && (
              <ActionBar
                field={element}
                handleDuplicateElement={handlers.handleDuplicateElement}
                handleRemoveElement={handlers.handleRemoveElement}
                handleSettingsClick={handlers.handleSettingsClick}
              />
            )}
          </ElementEditor>
        </main>

        <aside className="sticky bottom-0 top-[6.25rem] hidden h-[calc(100vh-6.25rem)] w-full max-w-sm shrink-0 flex-col overflow-auto border-l lg:block">
          {getIsScreen(element) && (
            <ScreenSettings
              handleCreateElement={handlers.handleCreateElement}
              screen={element}
            />
          )}
          {getIsField(element) && <FieldSettings field={element} />}
        </aside>
      </div>
      <Drawer
        open={settings.isOpen}
        onOpenChange={settings.setIsOpen}
        direction="bottom"
        shouldScaleBackground={false}
      >
        <DrawerContent className="flex max-h-[90%] flex-col">
          <ScrollArea className="overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-lg">
              {getIsScreen(element) && (
                <ScreenSettings
                  handleCreateElement={handlers.handleCreateElement}
                  screen={element}
                />
              )}
              {getIsField(element) && <FieldSettings field={element} />}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};
