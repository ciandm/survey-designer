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
      onPaste={(e) => {
        e.preventDefault();
        e.currentTarget.innerText = e.clipboardData.getData('text/plain');
      }}
      className={cn(
        'cursor-text whitespace-break-spaces rounded-[4px] text-sm text-foreground outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary',
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
