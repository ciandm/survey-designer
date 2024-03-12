import React from 'react';
import {Separator} from '@/components/ui/separator';
import {SurveyElementType} from '@/types/element';
import {FieldType} from '@/types/field';
import {ElementTypeSelect} from './element-type-select';
import {SettingsField} from './settings-field';

type SettingsWrapperProps = {
  children: React.ReactNode;
  elementType: SurveyElementType;
  onChangeElementType: (type: FieldType) => void;
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
                onChange={onChangeElementType}
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
