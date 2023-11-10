'use client';

import React, {useState} from 'react';
import {QuestionType} from '@prisma/client';
import {
  Check,
  FileQuestion,
  Loader2,
  MoreVertical,
  Plus,
  Text,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ToastAction} from '@/components/ui/toast';
import {useToast} from '@/components/ui/use-toast';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useAddQuestion} from '../hooks/use-add-question';
import {useDeleteQuestion} from '../hooks/use-delete-question';
import {useDuplicateQuestion} from '../hooks/use-duplicate-question';
import {useQuestionActions, useQuestions} from '../store/questions';
import {SidebarQuestionItem} from './sidebar-question-item';

export const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  LONG_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  SHORT_TEXT: <Text className="h-4 w-4 flex-shrink-0" />,
  MULTIPLE_CHOICE: <Check className="h-4 w-4 flex-shrink-0" />,
  SINGLE_CHOICE: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

export const QuestionsSidebar = () => {
  const [menuOpenId, setMenuOpenId] = useState('');
  const questions = useQuestions();
  const {toast} = useToast();
  const {activeQuestion, setActiveQuestion} = useActiveQuestion();
  const {setQuestions} = useQuestionActions();

  const {mutateAsync: handleAddQuestion, isPending: isPendingAddQuestion} =
    useAddQuestion();
  const {mutateAsync: handleDeleteQuestion} = useDeleteQuestion();
  const {mutateAsync: handleDuplicateQuestion} = useDuplicateQuestion();

  const onNewQuestionClick = async () => {
    try {
      const {data} = await handleAddQuestion({});
      setQuestions(data.schema.fields);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteQuestionClick = async (id: string) => {
    try {
      const {data} = await handleDeleteQuestion({id});
      setQuestions(data.schema.fields);
      toast({
        title: 'Question deleted',
        description: 'The question has been deleted from the survey.',
        action: <ToastAction altText="Undo">Undo</ToastAction>,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onDuplicateQuestionClick = async (id: string) => {
    try {
      const {data} = await handleDuplicateQuestion({id});
      setQuestions(data.schema.fields);
      toast({
        title: 'Question duplicated',
        description: 'The question has been duplicated.',
        action: <ToastAction altText="Undo">Undo</ToastAction>,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="flex min-w-[260px] max-w-[260px] flex-1 flex-col overflow-hidden bg-gray-900">
      <Button
        variant="ghost"
        className="my-4 justify-start rounded-none font-semibold text-white hover:bg-primary hover:text-white"
        onClick={onNewQuestionClick}
      >
        <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-[2px] bg-primary">
          <Plus className="h-5 w-5" />
        </div>
        New question
        {isPendingAddQuestion && (
          <Loader2 className="ml-auto h-4 w-4 animate-spin" />
        )}
      </Button>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ol className="flex flex-1 flex-col gap-2">
          {questions.map((question, index) => (
            <SidebarQuestionItem
              key={question.id}
              question={question}
              index={index}
              isSelected={question.id === activeQuestion?.id}
              type={question.type}
              onClick={() => {
                if (!!menuOpenId) return;
                setActiveQuestion(question.ref);
              }}
            >
              <DropdownMenu
                modal
                onOpenChange={(checked) =>
                  setMenuOpenId(checked ? question.id : '')
                }
              >
                <DropdownMenuTrigger
                  asChild
                  className={cn(
                    'invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100',
                    {
                      'visible opacity-100': menuOpenId === question.id,
                    },
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 flex-shrink-0 text-gray-50 hover:bg-transparent hover:text-gray-50 focus:text-gray-50"
                  >
                    <span className="sr-only">Actions</span>
                    <MoreVertical className="h-4 w-4 text-inherit" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      onDuplicateQuestionClick(question.id);
                      setMenuOpenId('');
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      onDeleteQuestionClick(question.id);
                      setMenuOpenId('');
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarQuestionItem>
          ))}
        </ol>
      </div>
    </aside>
  );
};
