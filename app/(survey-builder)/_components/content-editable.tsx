import {useRef} from 'react';
import ContentEditableExt, {
  Props as ContentEditableProps,
} from 'react-contenteditable';
import {cn} from '@/lib/utils';

interface Props extends Omit<ContentEditableProps, 'html' | 'onChange'> {
  placeholder?: string;
  value?: string;
}

export const ContentEditable = ({
  value = '',
  className,
  placeholder,
  ...props
}: Props) => {
  const ref = useRef<HTMLElement>(null);
  return (
    // @ts-ignore
    <ContentEditableExt
      className={cn(
        'cursor-text whitespace-break-spaces rounded-[4px] text-sm text-foreground outline-none ring-offset-2 empty:text-muted-foreground empty:before:content-[attr(data-placeholder)] focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      innerRef={ref}
      contentEditable
      data-placeholder={placeholder}
      html={value}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain');
        const selectedRange = window.getSelection()?.getRangeAt(0);
        if (!selectedRange || !text) return;

        selectedRange.deleteContents();
        selectedRange.insertNode(document.createTextNode(text));
        selectedRange.setStart(
          selectedRange.endContainer,
          selectedRange.endOffset,
        );
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          ref.current?.blur();
        }
      }}
      {...props}
    />
  );
};
