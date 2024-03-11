import {ID_PREFIXES} from '@/lib/constants/element';
import {choiceElementTypes, elementTypes} from '@/lib/validations/element';
import {ChoicesSchema, ElementSchema, ElementType} from '@/types/element';
import {ParsedModelType} from '@/types/survey';
import {formatElementType} from './survey';

export const getElementTypeGroup = (type: ElementType) => {
  if (choiceElementTypes.options.find((t) => t === type)) {
    return 'Choices';
  }

  return 'Text';
};

type Option = {
  group: string;
  options: {
    value: ElementType;
    label: string;
  }[];
};

export const elementTypeOptions = elementTypes.options.reduce<Option[]>(
  (acc, type) => {
    const group = getElementTypeGroup(type);
    const option = {
      group,
      options: elementTypes.options
        .filter((t) => t === type)
        .map((t) => ({
          value: t,
          label: formatElementType(t),
        })),
    };

    if (acc.some((o) => o.group === group)) {
      acc.find((o) => o.group === group)?.options.push(option.options[0]);
    } else {
      acc.push(option);
    }

    return acc;
  },
  [],
);

function hasChoices(element: ElementSchema) {
  return element.type === 'multiple_choice' || element.type === 'single_choice';
}

export function sortChoices(model: ParsedModelType): ParsedModelType {
  const {elements} = model;
  const copiedSchema = {...model};

  const newElements = elements.map((el) => {
    const element = {...el, properties: {...el.properties}};
    if (hasChoices(element)) {
      switch (element.properties.sort_order) {
        case 'asc':
          element.properties.choices = element.properties.choices?.reverse();
          break;
        case 'random':
          element.properties.choices = randomiseChoices(
            element.properties.choices,
          );
          break;
        default:
          break;
      }
    }

    return element;
  });

  copiedSchema.elements = newElements;
  return copiedSchema;
}

function randomiseChoices(choices: ChoicesSchema = []) {
  const copiedChoices = [...choices];

  return copiedChoices.sort((choice) => {
    if (choice.id.startsWith(ID_PREFIXES.OTHER_CHOICE)) return 1;

    return Math.random() - 0.5;
  });
}
