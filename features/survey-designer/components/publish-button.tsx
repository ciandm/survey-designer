'use client';

import React from 'react';
import {Button, ButtonProps} from '@/components/ui/button';
import {
  surveyPublishedSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';
import {usePublishTrigger} from './publish-dialog';

export const PublishButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const onPublish = usePublishTrigger();
    const isPublished = useSurveyDesignerStore(surveyPublishedSelector);

    return (
      <Button
        size="sm"
        ref={ref}
        {...props}
        onClick={() => onPublish(isPublished ? 'unpublish' : 'publish')}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
    );
  },
);

PublishButton.displayName = 'PublishButton';
