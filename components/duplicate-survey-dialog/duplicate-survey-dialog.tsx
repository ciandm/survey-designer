'use client';

import {Loader2} from 'lucide-react';
import {useDesignerStoreSurveyId} from '@/features/survey-designer/store/designer-store';
import {UseSurveyFormProps} from '@/hooks/use-survey-form';
import {SurveyDialog} from '../survey-dialog';
import {Button} from '../ui/button';
import {DialogHeader, DialogTitle} from '../ui/dialog';
import {useDuplicateSurveyForm} from './use-duplicate-survey-form';

type DuplicateSurveyFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: UseSurveyFormProps['initialData'];
  id: string;
};

export const DuplicateSurveyDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  id,
}: DuplicateSurveyFormProps) => {
  const {form, status, onSubmit} = useDuplicateSurveyForm({initialData, id});

  return (
    <SurveyDialog
      onOpenChange={onOpenChange}
      form={form}
      onSubmit={onSubmit}
      isOpen={isOpen}
      header={
        <DialogHeader>
          <DialogTitle>Copy survey</DialogTitle>
        </DialogHeader>
      }
      actions={
        <div className="ml-auto mt-8 flex gap-2">
          <Button
            disabled={status === 'executing'}
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={status === 'executing'}>
            {status === 'executing' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Make a copy
          </Button>
        </div>
      }
    />
  );
};
