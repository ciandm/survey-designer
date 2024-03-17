import {ChoicesSchema} from '@/types/field';

export const isAddChoiceDisabled = (choices: ChoicesSchema = []): boolean => {
  return choices.filter((choice) => choice.value === '').length > 1;
};

export const isRemoveAllDisabled = (choices: ChoicesSchema = []): boolean => {
  return choices.length === 1;
};
