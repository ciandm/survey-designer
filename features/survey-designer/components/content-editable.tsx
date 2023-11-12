import React from 'react';
import ContentEditableExt, {
  Props as ContentEditableProps,
} from 'react-contenteditable';
import {cn} from '@/lib/utils';

interface Props extends ContentEditableProps {
  placeholder?: string;
}

export const ContentEditable = ({
  html,
  className,
  placeholder,
  ...props
}: Props) => {
  return (
    // @ts-ignore
    <ContentEditableExt
      className={cn(
        'cursor-pointer whitespace-break-spaces rounded-[4px] text-sm text-foreground outline-none ring-primary focus-within:ring-2',
        className,
        {
          'text-muted-foreground': !html,
          [`before:content-[attr(data-placeholder)]`]: !html,
        },
      )}
      data-placeholder={placeholder}
      html={html}
      {...props}
    />
  );
};
