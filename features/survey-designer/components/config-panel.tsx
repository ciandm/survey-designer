'use client';

import {useState} from 'react';
import {
  EraserIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import {Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {
  deleteQuestionChoice,
  deleteQuestionChoices,
  insertQuestionChoice,
  updateQuestion,
  updateQuestionChoice,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';

type Panel = 'question' | 'choices' | 'logic' | 'validation';

const SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;

export const ConfigPanel = () => {
  const {activeQuestion} = useActiveQuestion();

  return <ConfigPanelInner key={activeQuestion.id} />;
};

const ConfigPanelInner = () => {
  const {activeQuestion} = useActiveQuestion();
  const [openPanel, setOpenPanel] = useState<Panel>('question');

  return (
    <aside className="hidden h-full max-w-sm flex-1 border-l bg-white lg:block">
      <div>
        <Panel
          title="Question"
          isOpen={openPanel === 'question'}
          onClick={() => setOpenPanel('question')}
        >
          <div>
            <Label htmlFor="question-type">Type</Label>
            <QuestionTypeSelect id="question-type" />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Textarea
              name="title"
              id="title"
              value={activeQuestion.text}
              onChange={(e) =>
                updateQuestion({
                  id: activeQuestion.id,
                  text: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              name="description"
              id="description"
              value={activeQuestion.description}
              onChange={(e) =>
                updateQuestion({
                  id: activeQuestion.id,
                  description: e.target.value,
                })
              }
            />
          </div>
          {(activeQuestion.type === 'short_text' ||
            activeQuestion.type === 'long_text') && (
            <div>
              <Label htmlFor="placeholder">Placeholder (optional)</Label>
              <Textarea
                name="placeholder"
                id="placeholder"
                value={activeQuestion.properties.placeholder}
                onChange={(e) =>
                  updateQuestion({
                    id: activeQuestion.id,
                    properties: {
                      placeholder: e.target.value,
                    },
                  })
                }
                placeholder="Your answer here..."
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="flex items-center">
              <Checkbox
                className="mr-2"
                onCheckedChange={(checked) => {
                  updateQuestion({
                    id: activeQuestion.id,
                    validations: {
                      required: !!checked,
                    },
                  });
                }}
                checked={activeQuestion.validations.required}
              />
              <span>Make this question required</span>
            </label>
            {activeQuestion.validations.required && (
              <>
                <div className="mt-2 flex items-center justify-between">
                  <Label htmlFor="required">Required error message</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <QuestionMarkCircledIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="left">
                      <p className="text-xs leading-snug">
                        If the question is required, this message will be shown
                        if the user tries to submit the form without answering
                        this question. Defaults to &quot;This field is
                        required&quot;.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Textarea
                  name="required"
                  id="required"
                  value={activeQuestion.properties.required_message}
                  onChange={(e) =>
                    updateQuestion({
                      id: activeQuestion.id,
                      properties: {
                        required_message: e.target.value,
                      },
                    })
                  }
                />
              </>
            )}
          </div>
        </Panel>
        {activeQuestion.type === 'multiple_choice' && (
          <Panel
            title="Choices"
            isOpen={openPanel === 'choices'}
            onClick={() => setOpenPanel('choices')}
          >
            <div>
              <div className="mb-2 grid grid-cols-[1fr_40px_40px] items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">Choices</p>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    deleteQuestionChoices({questionId: activeQuestion.id})
                  }
                >
                  <EraserIcon className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    insertQuestionChoice({
                      questionId: activeQuestion.id,
                    })
                  }
                >
                  <PlusCircledIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {(activeQuestion.properties.choices ?? []).map((choice) => (
                  <div
                    key={choice.id}
                    className="grid grid-cols-[1fr_40px] gap-2"
                  >
                    <Input
                      type="text"
                      value={choice.value}
                      onChange={(e) =>
                        updateQuestionChoice({
                          questionId: activeQuestion.id,
                          newChoice: {
                            id: choice.id,
                            value: e.target.value,
                          },
                        })
                      }
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        deleteQuestionChoice({
                          questionId: activeQuestion.id,
                          choiceId: choice.id,
                        })
                      }
                      disabled={activeQuestion.properties.choices?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <label className="flex flex-col items-start">
              <span className="mb-2">Sort choices</span>
              <Select
                value={activeQuestion.properties.sort_order ?? 'none'}
                onValueChange={(value) => {
                  updateQuestion({
                    id: activeQuestion.id,
                    properties: {
                      sort_order: value === 'none' ? undefined : (value as any),
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SORT_ORDER_OPTIONS.map((option) => (
                      <SelectItem value={option.value} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          </Panel>
        )}
        <Panel
          title="Logic"
          isOpen={openPanel === 'logic'}
          onClick={() => setOpenPanel('logic')}
        >
          Logic content
        </Panel>
        <Panel
          title="Validation"
          onClick={() => setOpenPanel('validation')}
          isOpen={openPanel === 'validation'}
        >
          Validation content
        </Panel>
      </div>
    </aside>
  );
};

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
};

const Panel = ({children, title, isOpen = false, onClick}: Props) => (
  <>
    <button className="w-full border-b p-4 text-left" onClick={onClick}>
      <h2
        className={cn(
          'text-md leading-none text-muted-foreground transition-colors hover:text-foreground',
          {
            'font-medium text-foreground': isOpen,
          },
        )}
      >
        {title}
      </h2>
    </button>
    {isOpen && (
      <div className="flex h-full flex-col gap-4 border-b bg-muted p-4">
        {children}
      </div>
    )}
  </>
);
