import React from 'react';
import {QuestionType} from '@prisma/client';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';
import {ICON_MAP} from './question-sidebar';

interface QuestionItemProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isSelected?: boolean;
  children: React.ReactNode;
  type: QuestionType;
  index: number;
  question: QuestionConfig;
}
export const QuestionItem = ({
  onClick,
  isSelected,
  children,
  type,
  index,
  question,
}: QuestionItemProps) => {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
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
            {question.text || '...'}
          </p>
        </div>
      </li>
      {children}
    </div>
  );
};
