import React from 'react';
import {Separator} from '@/components/ui';
import {SurveyElementType} from '@/types/element';
import {FieldType} from '@/types/field';
import {ElementTypeSelect} from './element-type-select';
import {SettingsField, SettingsFieldLabel} from './settings-field';

type SettingsShellProps = {
  children: React.ReactNode;
  elementType: SurveyElementType;
  onChangeElementType: (type: FieldType) => void;
};

export const SettingsShell = ({
  children,
  elementType,
  onChangeElementType,
}: SettingsShellProps) => {
  return (
    <>
      <div className="p-4">
        <SettingsField>
          {({id}) => (
            <>
              <SettingsFieldLabel>Type</SettingsFieldLabel>
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
