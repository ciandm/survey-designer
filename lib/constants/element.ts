import {
  CheckboxIcon,
  FileTextIcon,
  InputIcon,
  RadiobuttonIcon,
} from '@radix-ui/react-icons';

export const ELEMENT_TYPE = {
  short_text: 'short_text',
  long_text: 'long_text',
  multiple_choice: 'multiple_choice',
  single_choice: 'single_choice',
} as const;

export const SCREEN_TYPE = {
  welcome: 'welcome',
  thank_you: 'thank_you',
};

export type ElementType = keyof typeof ELEMENT_TYPE;
export type ScreenType = keyof typeof SCREEN_TYPE;

export const ID_PREFIXES = {
  ELEMENT: 'element-',
  ELEMENT_CHOICE: 'choice-',
  OTHER_CHOICE: 'other-',
} as const;

export const ELEMENT_OPTIONS = [
  {
    label: 'Multiple choice',
    value: ELEMENT_TYPE.multiple_choice,
    icon: CheckboxIcon,
  },
  {label: 'Short text', value: ELEMENT_TYPE.short_text, icon: InputIcon},
  {label: 'Long text', value: ELEMENT_TYPE.long_text, icon: FileTextIcon},
  {
    label: 'Single choice',
    value: ELEMENT_TYPE.single_choice,
    icon: RadiobuttonIcon,
  },
];
