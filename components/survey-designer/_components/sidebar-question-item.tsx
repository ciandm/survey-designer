import React from 'react';
import {QuestionType} from '@prisma/client';
import {cn, formatQuestionType} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';

interface SidebarQuestionItemProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isSelected?: boolean;
  children: React.ReactNode;
  type: QuestionType;
  index: number;
  question: QuestionConfig;
}
export const SidebarQuestionItem = ({
  onClick,
  isSelected,
  children,
  type,
  index,
  question,
}: SidebarQuestionItemProps) => {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      className={cn(
        'group box-border flex min-h-[56px] cursor-pointer items-center justify-between rounded-sm p-2 text-left',
        {
          'bg-slate-100': isSelected,
        },
      )}
    >
      <li className="mr-4 flex w-full items-center gap-2">
        <div className="self-center">
          <div className="flex">
            <span className="w-8 flex-shrink-0 text-sm font-semibold leading-tight text-gray-900">
              {index + 1}
            </span>
            <div className="flex flex-col items-start gap-2">
              <div className="line-clamp-2">
                <p className="text-sm font-semibold leading-tight text-gray-900">
                  {question.text || '...'}
                </p>
              </div>
              <p className="text-xs uppercase leading-tight tracking-wide text-gray-500">
                {formatQuestionType(type)}
              </p>
            </div>
          </div>
        </div>
      </li>
      {children}
    </div>
  );
};
