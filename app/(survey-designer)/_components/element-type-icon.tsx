import React from 'react';
import {
  CheckboxIcon,
  FileTextIcon,
  InputIcon,
  RadiobuttonIcon,
} from '@radix-ui/react-icons';
import {SurveyElementTypes} from '@/types/element';

const ELEMENT_OPTION_ICONS = {
  short_text: InputIcon,
  long_text: FileTextIcon,
  single_choice: RadiobuttonIcon,
  multiple_choice: CheckboxIcon,
  welcome_screen: InputIcon,
  thank_you_screen: FileTextIcon,
} as const;

type ElementTypeIconProps = {
  type?: SurveyElementTypes;
  className?: string;
};

export const ElementTypeIcon = ({type, className}: ElementTypeIconProps) => {
  if (!type) return null;

  const Icon = ELEMENT_OPTION_ICONS[type];
  return <Icon className={className} />;
};
