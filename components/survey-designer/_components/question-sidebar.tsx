import React, {useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {QuestionType} from '@prisma/client';
import {useIsMutating} from '@tanstack/react-query';
import {Check, FileQuestion, MoreVertical, Text} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {cn} from '@/lib/utils';

const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  LONG_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  SHORT_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  MULTIPLE_CHOICE: <Check className="h-4 w-4 flex-shrink-0" />,
  SINGLE_CHOICE: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

interface Props {
  children: (props: {
    fixedField: string | null;
    setFixedField: (field: string | null) => void;
  }) => React.ReactNode;
  addQuestionComponent?: React.ReactNode;
}

export const QuestionSidebar = ({children, addQuestionComponent}: Props) => {
  const [parent] = useAutoAnimate();
  const isMutating = useIsMutating({
    mutationKey: ['survey-schema'],
  });

  const [fixedField, setFixedField] = useState<string | null>(null);

  return (
    <aside className="flex w-full max-w-[260px] flex-col overflow-hidden border-r">
      <header className="flex items-center justify-between border-b p-4">
        <h5 className="text-md font-semibold tracking-tight">questions</h5>
        {addQuestionComponent}
      </header>
      {!!isMutating && <p>loading...</p>}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ul className="flex flex-1 flex-col" ref={parent}>
          {children({fixedField, setFixedField})}
        </ul>
      </div>
    </aside>
  );
};

interface QuestionItemProps {
  onClick?: () => void;
  fixedField?: string | null;
  isSelected?: boolean;
  children: React.ReactNode;
  type: QuestionType;
  index: number;
  menu?: React.ReactNode;
}
export const QuestionItem = ({
  onClick,
  fixedField,
  isSelected,
  children,
  type,
  index,
  menu,
}: QuestionItemProps) => {
  return (
    <div
      tabIndex={0}
      onClick={(e) => {
        if (fixedField) return;
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        'group box-border flex min-h-[56px] cursor-pointer items-center justify-between p-4 text-left',
        {
          'bg-slate-100': isSelected,
        },
      )}
    >
      <li className="mr-4 flex w-full items-center gap-2">
        <Badge className="flex w-full max-w-[56px] flex-shrink-0 justify-between px-2">
          {ICON_MAP[type]}
          <span className="text-xs">{index + 1}</span>
        </Badge>
        <div className="line-clamp-2 self-center">
          <p className="text-xs font-medium leading-tight text-gray-500">
            {children}
          </p>
        </div>
      </li>
      {menu}
    </div>
  );
};

interface QuestionItemMenuProps {
  fixedField: string | null;
  setFixedField: (field: string | null) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  fieldRef: string;
}

export const QuestionItemMenu = ({
  fixedField,
  setFixedField,
  onDuplicate,
  onDelete,
  fieldRef,
}: QuestionItemMenuProps) => {
  return (
    <DropdownMenu
      modal
      onOpenChange={(open) => setFixedField(open ? fieldRef : null)}
    >
      <DropdownMenuTrigger
        asChild
        className={cn(
          'invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100',
          {
            'visible opacity-100': fixedField === fieldRef,
          },
        )}
      >
        <Button variant="ghost" size="icon" className="w-8 flex-shrink-0">
          <span className="sr-only">Actions</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => {
            e.stopPropagation();
            onDuplicate();
            setFixedField(null);
          }}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.stopPropagation();
            onDelete();
            setFixedField(null);
          }}
          className="text-red-600"
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
