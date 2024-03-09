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

export const ELEMENT_CHOICE_SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;
