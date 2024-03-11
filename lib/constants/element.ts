import {
  CheckboxIcon,
  FileTextIcon,
  InputIcon,
  RadiobuttonIcon,
} from '@radix-ui/react-icons';
import {SurveyElementTypes} from '@/types/element';

export const ID_PREFIXES = {
  ELEMENT: 'element-',
  ELEMENT_CHOICE: 'choice-',
  OTHER_CHOICE: 'other-',
} as const;

type ElementOptions = {
  group: 'Text' | 'Choices' | 'Screens';
  options: {
    value: SurveyElementTypes;
    label: string;
  }[];
};

export const ELEMENT_OPTIONS: ElementOptions[] = [
  {
    group: 'Text',
    options: [
      {label: 'Short text', value: 'short_text'},
      {label: 'Long text', value: 'long_text'},
    ],
  },
  {
    group: 'Choices',
    options: [
      {label: 'Single choice', value: 'single_choice'},
      {label: 'Multiple choice', value: 'multiple_choice'},
    ],
  },
  {
    group: 'Screens',
    options: [
      {label: 'Welcome screen', value: 'welcome_screen'},
      {
        label: 'Thank you screen',
        value: 'thank_you_screen',
      },
    ],
  },
];

export const ELEMENT_CHOICE_SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;
