import React from 'react';
import {Button} from '@/components/ui/button';
import {ScreenSchema} from '@/types/element';
import {getStoreKeyForScreenType} from '@/utils/screen';
import {useDesignerHandlers} from '../designer/designer.context';

type ScreenEditorProps = {
  element: ScreenSchema;
};

export const ScreenEditor = ({element}: ScreenEditorProps) => {
  const {handleRemoveScreen} = useDesignerHandlers();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">
          {element.text}
        </h1>
        {element.description && (
          <p className="text-sm leading-6 text-gray-600">
            {!!element.description
              ? element.description
              : 'Description (optional)'}
          </p>
        )}
      </div>
      {element.type === 'welcome_screen' && (
        <Button size="lg">{element.properties.button_label}</Button>
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
