import React from 'react';
import {Separator} from '@/components/ui/separator';
import {ElementType, SurveyElementTypes} from '@/types/element';
import {ElementTypeSelect} from '../../element-type-select';
import {SettingsField} from './settings-field';

type SettingsWrapperProps = {
  children: React.ReactNode;
  elementType: SurveyElementTypes;
  onChangeElementType: (type: ElementType) => void;
};

export const SettingsWrapper = ({
  children,
  elementType,
  onChangeElementType,
}: SettingsWrapperProps) => {
  return (
    <>
      <div className="p-4">
        <SettingsField>
          {({id}) => (
            <>
              <SettingsField.Label>Type</SettingsField.Label>
              <ElementTypeSelect
                type={elementType}
                onChange={(type) => onChangeElementType(type)}
                id={id}
              />
            </>
          )}
        </SettingsField>
      </div>
      <Separator />
      {children}
    </>
  );
};
