'use client';

import React from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useDesignerActions,
  useSurveyElements,
} from '../../../features/survey-designer/store/survey-designer-store';

type ElementsDndContextProps = {
  children: React.ReactNode;
};

export const ElementsDndContext = ({children}: ElementsDndContextProps) => {
  const elements = useSurveyElements();
  const {setElements} = useDesignerActions();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id) {
      setElements((elements) => {
        const oldIndex = elements.findIndex((q) => q.id === active.id);
        const newIndex = elements.findIndex((q) => q.id === over?.id);

        return arrayMove(elements, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={elements.map((element) => element.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
