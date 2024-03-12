'use client';

import {useState} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
import {
  ElementGroup,
  ElementSchema,
  ElementType,
  ScreenSchema,
  ScreenType,
} from '@/types/element';
import {cn} from '@/utils/classnames';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {getIsElementType, getIsScreenType} from '@/utils/survey';
import {
  useSurveyElements,
  useSurveyScreens,
  useSurveyStoreActions,
} from '../../_store/survey-designer-store';
import {UseDesignerHandlers} from '../designer/use-designer';
import {ElementTypeIcon} from '../element-type-icon';
import {ElementCategoriesGrid} from './components/element-categories-grid';

type SurveyContentProps = {
  element: ElementSchema | ScreenSchema | null;
} & Pick<
  UseDesignerHandlers,
  'handleSelectElement' | 'handleCreateElement' | 'handleCreateScreen'
>;

export const SurveyContent = ({
  element,
  handleSelectElement,
  handleCreateElement,
  handleCreateScreen,
}: SurveyContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const storeActions = useSurveyStoreActions();
  const elements = useSurveyElements();
  const screens = useSurveyScreens();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      storeActions.setElements((elements) => {
        const oldIndex = elements.findIndex((q) => q.id === active.id);
        const newIndex = elements.findIndex((q) => q.id === over?.id);

        return arrayMove(elements, oldIndex, newIndex);
      });
    }
  };

  const handleClickOption = (
    group: ElementGroup,
    type: ElementType | ScreenType,
  ) => {
    if (group === 'Screens' && getIsScreenType(type)) {
      handleCreateScreen({key: getStoreKeyForScreenType(type)});
    } else {
      if (getIsElementType(type)) {
        handleCreateElement({type});
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
        <ul className="flex h-full w-full flex-1 flex-col items-stretch">
          {screens.welcome.length > 0 && (
            <li className="w-full">
              <ContentRow
                isActive={element?.id === screens.welcome[0].id}
                onClick={() => handleSelectElement(screens.welcome[0].id)}
              >
                <ButtonBadge>
                  <ElementTypeIcon type="welcome_screen" />
                </ButtonBadge>
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
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                {elements.map((el, index) => {
                  const text = !!el.text ? el.text : '...';
                  return (
                    <Sortable key={el.id} id={el.id}>
                      <li
                        key={el.id}
                        className={cn('w-full', {
                          'bg-accent': element?.id === el.id,
                        })}
                      >
                        <ContentRow
                          isActive={element?.id === el.id}
                          id={el.id}
                          onClick={() => handleSelectElement(el.id)}
                        >
                          <ButtonBadge>
                            <ElementTypeIcon type={el.type} />
                            {index + 1}
                          </ButtonBadge>
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
            <li className="mt-auto w-full">
              <ContentRow
                isActive={element?.id === screens.thank_you[0].id}
                onClick={() => handleSelectElement(screens.thank_you[0].id)}
              >
                <ButtonBadge>
                  <ElementTypeIcon type="thank_you_screen" />
                </ButtonBadge>
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
  isActive: boolean;
  id?: string;
};

const ContentRow = ({children, onClick, isActive}: ContentRow) => {
  return (
    <>
      <DropdownMenu>
        <div
          onClick={onClick}
          className={cn(
            'flex min-h-[3rem] w-full items-center gap-3 p-2',
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
        <DropdownMenuContent side="right">
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const ButtonBadge = ({children}: {children: React.ReactNode}) => {
  return (
    <span className="flex w-full max-w-[4rem] items-center gap-2 rounded-sm bg-primary/30 px-2.5 py-1 text-xs font-medium text-primary">
      {children}
    </span>
  );
};
