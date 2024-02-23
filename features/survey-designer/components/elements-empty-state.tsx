import React from 'react';
import {QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import {AddQuestion} from './add-question';

export const ElementsEmptyState = () => {
  return (
    <div className="mx-auto flex flex-col items-center py-12">
      <QuestionMarkCircledIcon className="mx-auto mb-2 h-10 w-10" />
      <h3 className="mt-2 font-semibold text-foreground">No questions yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding a new question
      </p>
      <div className="mt-6">
        <AddQuestion />
      </div>
    </div>
  );
};
