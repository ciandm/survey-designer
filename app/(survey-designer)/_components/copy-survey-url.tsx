'use client';

import React from 'react';
import {CheckCircleIcon, CheckIcon} from '@heroicons/react/20/solid';
import {CopyIcon} from 'lucide-react';
import {useParams} from 'next/navigation';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {cn} from '@/utils/classnames';

export const CopySurveyUrl = ({className}: {className?: string}) => {
  const {id} = useParams();
  const shareHref =
    typeof window !== 'undefined'
      ? `${window.location.origin}/survey/${id}`
      : '';
  const handleCopy = () => {
    navigator.clipboard.writeText(shareHref);
    toast('Copied to clipboard', {
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      position: 'bottom-center',
      id: 'copy-survey-url',
    });
  };

  return (
    <div className={cn('flex space-x-2', className)}>
      <Input readOnly defaultValue={shareHref} />
      <Button size="icon" className="h-9" onClick={handleCopy}>
        <CopyIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
