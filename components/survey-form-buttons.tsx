import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
import {useSurveyFormContext} from '@/hooks/use-survey';
import {ParsedModelType} from '@/types/survey';
import {Button} from './ui/button';

type SurveyFormButtonsProps = {
  onBack: () => void;
  model: ParsedModelType;
  currentElementId: string;
  children: React.ReactNode;
};

export const SurveyFormButtons = ({
  onBack,
  model,
  currentElementId,
  children,
}: SurveyFormButtonsProps) => {
  const {elements} = model;
  const {formState} = useSurveyFormContext();
  const currentElementIndex = elements.findIndex(
    (el) => el.id === currentElementId,
  );
  const isFirstElement = currentElementIndex === 0;
  const isLastElement = currentElementIndex === elements.length - 1;

  const SubmitIcon = isLastElement ? CheckIcon : ArrowRightIcon;
  const submitText = isLastElement ? 'Complete survey' : 'Next question';

  return (
    <>
      {elements.length > 1 && (
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          className="mb-8 p-0"
          size="sm"
          disabled={isFirstElement}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      {children}
      <Button
        type="submit"
        disabled={formState.isSubmitting}
        className="mt-12"
        size="lg"
      >
        {formState.isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {submitText}
        <SubmitIcon className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
};
