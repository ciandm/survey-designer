import {Loader2} from 'lucide-react';
import {useSurveyFormContext} from '@/hooks/use-survey';
import {Button} from './ui/button';

type SurveyFormButtonsProps = {
  onBack: () => void;
  isLastElement: boolean;
  isFirstElement: boolean;
};

export const SurveyFormButtons = ({
  onBack,
  isFirstElement,
  isLastElement,
}: SurveyFormButtonsProps) => {
  const {formState} = useSurveyFormContext();
  return (
    <div className="flex justify-between">
      {!isFirstElement && (
        <Button type="button" onClick={onBack}>
          Back
        </Button>
      )}
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isLastElement ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};
