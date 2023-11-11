'use client';

import React, {useState} from 'react';
import {Check, FileQuestion, MoreVertical, Plus, Text} from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {QUESTION_TYPE, QuestionType} from '@/lib/constants/question';
import {cn, getNextQuestionToSelect} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {
  useSurveyQuestions,
  useSurveyQuestionsActions,
} from '../store/survey-designer';
import {SidebarQuestionItem} from './sidebar-question-item';

export const ICON_MAP: Record<QuestionType, React.ReactNode> = {
  long_text: <Text className="h-4 w-4 flex-shrink-0" />,
  short_text: <Text className="h-4 w-4 flex-shrink-0" />,
  multiple_choice: <Check className="h-4 w-4 flex-shrink-0" />,
  single_choice: <FileQuestion className="h-4 w-4 flex-shrink-0" />,
};

export const QuestionsSidebar = () => {
  const [menuOpenId, setMenuOpenId] = useState('');
  const questions = useSurveyQuestions();
  const {activeQuestion, setActiveQuestion} = useActiveQuestion();
  const {deleteQuestion, duplicateQuestion, insertQuestion} =
    useSurveyQuestionsActions();

  const onNewQuestionClick = async () => {
    const ref = uuidv4();
    insertQuestion({
      id: uuidv4(),
      type: QUESTION_TYPE.short_text,
      text: '',
      properties: {},
      ref,
      validations: {},
      description: '',
    });
    setActiveQuestion(ref);
  };

  const onDeleteQuestionClick = async (id: string) => {
    deleteQuestion({id});
    if (activeQuestion?.id === id) {
      setActiveQuestion(getNextQuestionToSelect(questions, id));
    }
  };

  const onDuplicateQuestionClick = async (id: string) => {
    const ref = uuidv4();
    duplicateQuestion({id, ref});
    setActiveQuestion(ref);
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
                    disabled={questions.length === 1}
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
