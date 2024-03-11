import React from 'react';
import {Button} from '@/components/ui/button';
import {getStoreKeyForScreenType} from '@/survey-designer/_utils/screen';
import {ScreenSchema} from '@/types/element';
import {useDesignerHandlers} from '../designer/designer.context';

type ScreenEditorProps = {
  element: ScreenSchema;
};

export const ScreenEditor = ({element}: ScreenEditorProps) => {
  const {handleRemoveScreen} = useDesignerHandlers();
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <h1>{element.text}</h1>
        <p>
          {!!element.description
            ? element.description
            : 'Description (optional)'}
        </p>
      </div>
      {element.type === 'welcome_screen' && (
        <Button>{element.properties.button_label}</Button>
      )}
      <Button
        variant="secondary"
        onClick={() =>
          handleRemoveScreen({
            key: getStoreKeyForScreenType(element.type),
            id: element.id,
          })
        }
      >
        Delete
      </Button>
    </div>
  );
};
