import {DraggableAttributes} from '@dnd-kit/core';
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities';
import {useSortable} from '@dnd-kit/sortable';

type SortableProps = {
  children: React.ReactNode;
  className?: string;
  id: string;
  isDisabled?: boolean;
  renderSortHandle?: (props: {
    listeners: SyntheticListenerMap | undefined;
    attributes: DraggableAttributes;
    isSorting: boolean;
  }) => React.ReactNode;
};

export const Sortable = ({
  children,
  className,
  id,
  isDisabled,
  renderSortHandle,
}: SortableProps) => {
  const {attributes, listeners, setNodeRef, transform, isSorting} = useSortable(
    {
      id,
      disabled: isDisabled,
    },
  );
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <div ref={setNodeRef} style={style} className={className}>
        {renderSortHandle &&
          renderSortHandle({attributes, listeners, isSorting})}
        {children}
      </div>
    </>
  );
};
