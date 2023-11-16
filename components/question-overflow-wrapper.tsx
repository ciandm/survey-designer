import {cn} from '@/lib/utils';

export const QuestionOverflowWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-1 items-center overflow-hidden', className)}>
      <div className="flex h-full flex-1 overflow-y-auto px-8">
        <div className="my-auto flex flex-1">{children}</div>
      </div>
    </div>
  );
};
