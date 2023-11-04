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
      className={cn('text-sm', className, {
        'text-gray-500': !html,
        [`before:content-[attr(data-placeholder)]`]: !html && placeholder,
      })}
      data-placeholder={placeholder}
      html={html}
      {...props}
    />
  );
};
