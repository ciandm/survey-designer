'use client';

import {useId} from 'react';
import {closestCenter, DndContext} from '@dnd-kit/core';
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {PlusIcon} from '@heroicons/react/20/solid';
import {DotsVerticalIcon} from '@radix-ui/react-icons';
import {isEmpty} from 'lodash';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDesignerStoreFieldsList,
  useDesignerStoreScreens,
} from '@/features/survey-designer/store/designer-store';
import {FieldSchema} from '@/types/field';
import {ScreenSchema} from '@/types/screen';
import {cn} from '@/utils/classnames';
import {UseDesignerElementReturn} from '../designer/hooks/use-designer-element';
import {ElementTypeIcon} from '../element-type-icon';
import {CategoriesDialog} from './components/categories-dialog';
import {useSortableContent} from './hooks/use-sortable-content';
import {useSurveyContent} from './hooks/use-survey-content';

type SurveyContentProps = {
  element: FieldSchema | ScreenSchema | null;
  onSetSelectedElement: UseDesignerElementReturn['handleSetSelectedElement'];
};

export const SurveyContent = ({
  element,
  onSetSelectedElement,
}: SurveyContentProps) => {
  const {
    dialog,
    handlers: {
      handleClickOption,
      handleDeleteField,
      handleDuplicateField,
      handleRemoveScreen,
      handleSelectScreen,
      handleSelectField,
    },
  } = useSurveyContent({element, onSetSelectedElement});
  const {handleDragEnd, sensors} = useSortableContent();
  const fields = useDesignerStoreFieldsList();
  const screens = useDesignerStoreScreens();

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-2">
          <h3 className="text-sm font-medium text-foreground">Content</h3>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => dialog.setIsOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ul className="flex h-full w-full flex-1 flex-col items-stretch overflow-auto">
          {!isEmpty(screens.welcome.data) && (
            <li className="w-full">
              <ContentRow
                isActive={
                  element?.id ===
                  screens.welcome.data[screens.welcome._entities[0]].id
                }
                onClick={() => handleSelectScreen({key: 'welcome'})}
                menuItems={
                  <DropdownMenuItem
                    onClick={() =>
                      handleRemoveScreen({
                        key: 'welcome',
                      })
                    }
                  >
                    Delete
                  </DropdownMenuItem>
                }
              >
                <ContentBadge>
                  <ElementTypeIcon type="welcome_screen" />
                </ContentBadge>
                <span className="truncate text-xs">Welcome screen</span>
              </ContentRow>
            </li>
          )}
          <div>
            <DndContext
              id={useId()}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext
                items={fields.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((fi, index) => {
                  const text = !!fi.text ? fi.text : '...';
                  return (
                    <Sortable key={fi.id} id={fi.id}>
                      {({attributes, listeners, isSorting}) => (
                        <li {...attributes} {...listeners}>
                          <ContentRow
                            isActive={element?.id === fi.id}
                            onClick={() => handleSelectField(fi.id)}
                            className={cn({
                              'cursor-grabbing': isSorting,
                            })}
                            menuItems={
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicateField(fi.id)}
                                >
                                  Duplicate
                                </DropdownMenuItem>
                                {fields.length > 1 && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      disabled={fields.length === 1}
                                      className="text-red-500"
                                      onClick={() => handleDeleteField(fi.id)}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </>
                            }
                          >
                            <ContentBadge>
                              <ElementTypeIcon type={fi.type} />
                              {index + 1}
                            </ContentBadge>
                            <span className="truncate text-xs">{text}</span>
                          </ContentRow>
                        </li>
                      )}
                    </Sortable>
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
          {!isEmpty(screens.thank_you.data) && (
            <li className="w-full">
              <ContentRow
                isActive={
                  element?.id ===
                  screens.thank_you.data[screens.thank_you._entities[0]].id
                }
                onClick={() => handleSelectScreen({key: 'thank_you'})}
                menuItems={
                  <DropdownMenuItem
                    onClick={() =>
                      handleRemoveScreen({
                        key: 'thank_you',
                      })
                    }
                  >
                    Delete
                  </DropdownMenuItem>
                }
              >
                <ContentBadge>
                  <ElementTypeIcon type="thank_you_screen" />
                </ContentBadge>
                <span className="truncate text-xs">Thank you screen</span>
              </ContentRow>
            </li>
          )}
        </ul>
      </div>
      <CategoriesDialog
        isOpen={dialog.isOpen}
        setIsOpen={dialog.setIsOpen}
        onOptionClick={handleClickOption}
      />
    </>
  );
};

type ContentRow = {
  children?: React.ReactNode;
  onClick?: () => void;
  isActive: boolean;
  menuItems?: React.ReactNode;
  className?: string;
};

const ContentRow = ({
  children,
  className,
  onClick,
  isActive,
  menuItems,
}: ContentRow) => {
  return (
    <DropdownMenu>
      <div
        onClick={onClick}
        className={cn(
          'flex min-h-[3rem] w-full cursor-pointer items-center gap-3 p-2 text-muted-foreground',
          isActive && 'bg-accent',
          className,
        )}
      >
        {children}
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto h-8 w-8 flex-shrink-0 group-hover:flex"
          >
            <DotsVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent side="right">{menuItems}</DropdownMenuContent>
    </DropdownMenu>
  );
};

const ContentBadge = ({children}: {children: React.ReactNode}) => {
  return (
    <span className="flex w-full max-w-[4rem] items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
      {children}
    </span>
  );
};
