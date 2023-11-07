import {cn} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';
import {useSurveyFieldActions} from '@/stores/survey-schema';
import {ContentEditable} from './content-editable';

interface Props {
  question: QuestionConfig;
  view: 'editable' | 'readonly';
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionWording = ({
  question,
  view = 'readonly',
  questionNumber,
  totalQuestions,
}: Props) => {
  const {updateQuestion} = useSurveyFieldActions();
  const {text, id, validations, description} = question;

  let content = null;

  const titleClassName = cn('text-2xl font-bold', {
    [`after:content-['*']`]: validations.required && text,
  });

  if (view === 'editable') {
    content = (
      <>
        <ContentEditable
          className={titleClassName}
          placeholder="Begin typing your question here..."
          html={text ?? ''}
          onChange={(e) =>
            updateQuestion({
              id,
              text: e.target.value,
            })
          }
        />
        <ContentEditable
          className="mt-2"
          placeholder="Description (optional)"
          html={description ?? ''}
          onChange={(e) =>
            updateQuestion({
              id: id,
              description: e.target.value,
            })
          }
        />
      </>
    );
  } else {
    content = (
      <>
        <h1 className={titleClassName}>{text}</h1>
        {!!description && <p className="mt-2">{description}</p>}
      </>
    );
  }

  return (
    <div className="mb-4 flex flex-col">
      <p className="mb-2 text-sm text-muted-foreground">
        Question {questionNumber} of {totalQuestions}
      </p>
      {content}
    </div>
  );
};
