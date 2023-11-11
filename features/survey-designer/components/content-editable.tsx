import React from 'react';
import ContentEditableExt, {
  Props as ContentEditableProps,
} from 'react-contenteditable';
import {cn} from '@/lib/utils/question';

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
        'cursor-pointer whitespace-break-spaces rounded-[4px] text-sm outline-none ring-blue-500 focus:ring-2',
        className,
        {
          'text-gray-500': !html,
          [`before:content-[attr(data-placeholder)]`]: !html,
        },
      )}
      data-placeholder={placeholder}
      html={html}
      {...props}
    />
  );
};
