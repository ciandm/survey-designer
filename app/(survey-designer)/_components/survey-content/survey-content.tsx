'use client';

import {useState} from 'react';
import {closestCenter, DndContext} from '@dnd-kit/core';
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {PlusIcon} from '@heroicons/react/20/solid';
import {DotsVerticalIcon} from '@radix-ui/react-icons';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ElementGroup} from '@/types/element';
import {FieldSchema, FieldType} from '@/types/field';
import {ScreenSchema, ScreenType} from '@/types/screen';
import {cn} from '@/utils/classnames';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {getIsFieldType, getIsScreenType} from '@/utils/survey';
import {
  useSurveyFields,
  useSurveyScreens,
} from '../../_store/survey-designer-store';
import {UseElementControllerHandlers} from '../designer/use-element-controller';
import {ElementTypeIcon} from '../element-type-icon';
import {ElementCategoriesGrid} from './components/element-categories-grid';
import {useSortableContent} from './use-sortable-content';

type SurveyContentProps = {
  element: FieldSchema | ScreenSchema | null;
  onSelectElement: UseElementControllerHandlers['handleSelectElement'];
  onCreateField: UseElementControllerHandlers['handleCreateField'];
  onRemoveField: UseElementControllerHandlers['handleRemoveField'];
  onCreateScreen: UseElementControllerHandlers['handleCreateScreen'];
  onDuplicateField: UseElementControllerHandlers['handleDuplicateField'];
  onRemoveScreen: UseElementControllerHandlers['handleRemoveScreen'];
};

export const SurveyContent = ({
  element,
  onSelectElement,
  onCreateField,
  onRemoveField,
  onCreateScreen,
  onDuplicateField,
  onRemoveScreen,
}: SurveyContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fields = useSurveyFields();
  const screens = useSurveyScreens();
  const {handleDragEnd, sensors} = useSortableContent();

  const handleClickOption = (
    group: ElementGroup,
    type: FieldType | ScreenType,
  ) => {
    if (group === 'Screens' && getIsScreenType(type)) {
      onCreateScreen({key: getStoreKeyForScreenType(type)});
    } else {
      if (getIsFieldType(type)) {
        onCreateField({type});
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-2">
          <h3 className="text-sm font-medium text-foreground">Content</h3>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ul className="flex h-full w-full flex-1 flex-col items-stretch overflow-auto">
          {screens.welcome.length > 0 && (
            <li className="w-full">
              <ContentRow
                isActive={element?.id === screens.welcome[0].id}
                onClick={() => onSelectElement(screens.welcome[0].id)}
                menuItems={
                  <DropdownMenuItem
                    onClick={() =>
                      onRemoveScreen({
                        id: screens.welcome[0].id,
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
                      <li
                        key={fi.id}
                        className={cn('w-full', {
                          'bg-accent': element?.id === fi.id,
                        })}
                      >
                        <ContentRow
                          isActive={element?.id === fi.id}
                          id={fi.id}
                          onClick={() => onSelectElement(fi.id)}
                          menuItems={
                            <>
                              <DropdownMenuItem
                                onClick={() => onDuplicateField(fi.id)}
                              >
                                Duplicate
                              </DropdownMenuItem>
                              {fields.length > 1 && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    disabled={fields.length === 1}
                                    className="text-red-500"
                                    onClick={() => onRemoveField(fi.id)}
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
                    </Sortable>
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
          {screens.thank_you.length > 0 && (
            <li className="w-full">
              <ContentRow
                isActive={element?.id === screens.thank_you[0].id}
                onClick={() => onSelectElement(screens.thank_you[0].id)}
                menuItems={
                  <DropdownMenuItem
                    onClick={() =>
                      onRemoveScreen({
                        id: screens.thank_you[0].id,
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add content to your survey</DialogTitle>
            <DialogDescription>
              Add questions, screens, and more to your survey.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ElementCategoriesGrid onOptionClick={handleClickOption} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type ContentRow = {
  children?: React.ReactNode;
  onClick?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isActive: boolean;
  id?: string;
  menuItems?: React.ReactNode;
};

const ContentRow = ({children, onClick, isActive, menuItems}: ContentRow) => {
  return (
    <>
      <DropdownMenu>
        <div
          onClick={onClick}
          className={cn(
            'flex min-h-[3rem] w-full items-center gap-3 p-2 text-muted-foreground',
            isActive && 'bg-accent',
          )}
        >
          {children}
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="ml-auto h-8 w-8 group-hover:flex"
            >
              <DotsVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent side="right">{menuItems}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const ContentBadge = ({children}: {children: React.ReactNode}) => {
  return (
    <span className="flex w-full max-w-[4rem] items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
      {children}
    </span>
  );
};
