import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
import {ParsedModelType} from '@/types/survey';
import {Button} from './ui/button';

type SurveyFormButtonsProps = {
  onBack: () => void;
  model: ParsedModelType;
  currentElementId: string;
  children: React.ReactNode;
  isSubmitting?: boolean;
};

export const SurveyFormButtons = ({
  onBack,
  model,
  currentElementId,
  children,
  isSubmitting = false,
}: SurveyFormButtonsProps) => {
  const {fields} = model;
  const currentElementIndex = fields.findIndex(
    (el) => el.id === currentElementId,
  );
  const isFirstElement = currentElementIndex === 0;
  const isLastElement = currentElementIndex === fields.length - 1;

  const SubmitIcon = isLastElement ? CheckIcon : ArrowRightIcon;
  const submitText = isLastElement ? 'Complete survey' : 'Next question';

  return (
    <>
      {fields.length > 1 && !isFirstElement && (
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          className="absolute -top-16 mb-8 p-0"
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
        disabled={isSubmitting}
        className="mt-12 self-start"
        size="lg"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
        <SubmitIcon className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
};
