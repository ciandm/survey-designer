import {ChoicesSchemaType} from '@/types/element';

export const isAddChoiceDisabled = (
  choices: ChoicesSchemaType = [],
): boolean => {
  return choices.filter((choice) => choice.value === '').length > 1;
};

export const isRemoveAllDisabled = (
  choices: ChoicesSchemaType = [],
): boolean => {
  return choices.length === 1;
};
