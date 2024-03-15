import {DraggableAttributes} from '@dnd-kit/core';
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

type SortableProps = {
  children:
    | React.ReactNode
    | ((props: {
        attributes: DraggableAttributes;
        listeners: SyntheticListenerMap | undefined;
        isSorting: boolean;
      }) => React.ReactNode);
  className?: string;
  id: string;
  isDisabled?: boolean;
};

export const Sortable = ({
  children,
  className,
  id,
  isDisabled,
}: SortableProps) => {
  const {attributes, listeners, setNodeRef, transform, transition, isSorting} =
    useSortable({
      id,
      disabled: isDisabled,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isSorting ? 'grabbing' : 'auto',
  };

  if (typeof children === 'function') {
    return (
      <div ref={setNodeRef} style={style} className={className}>
        {children({attributes, listeners, isSorting})}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
