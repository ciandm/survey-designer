'use client';

import React from 'react';
import {Button, ButtonProps} from '@/components/ui/button';
import {useSurveyPublished} from '@/survey-designer/_store/survey-designer-store';
import {usePublishTrigger} from './publish-dialog';

export const PublishButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const onPublish = usePublishTrigger();
    const isPublished = useSurveyPublished();

    return (
      <Button
        size="sm"
        variant="secondary"
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
