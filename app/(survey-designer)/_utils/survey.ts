import {v4 as uuidv4} from 'uuid';
import {
  CreateSurveyInput,
  ElementSchema,
  SurveyWithParsedSchema,
} from '@/lib/validations/survey';

function duplicateElements(elements: ElementSchema[]) {
  return elements.map((element) => ({
    ...element,
    id: uuidv4(),
    ref: uuidv4(),
    properties: {
      ...element.properties,
      choices:
        element.properties.choices?.map((choice) => ({
          ...choice,
          id: uuidv4(),
        })) ?? [],
    },
  }));
}

export function generateDuplicateSurvey(
  survey: SurveyWithParsedSchema,
  input: Omit<CreateSurveyInput, 'duplicatedFrom'>,
): Omit<SurveyWithParsedSchema, 'createdAt' | 'updatedAt' | 'id'> {
  const {schema} = survey;
  let newTitle = input.title;
  let newDescription = input.description;

  if (!newTitle) {
    newTitle = survey.schema.title
      ? `${survey.schema.title} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  if (!newDescription) {
    newDescription = schema.description
      ? `${schema.description} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  return {
    is_published: false,
    userId: survey.userId,
    schema: {
      ...survey.schema,
      title: newTitle,
      description: newDescription,
      elements: duplicateElements(survey.schema.elements),
    },
  };
}

export function generateNewSurvey(
  input: Omit<CreateSurveyInput, 'duplicatedFrom'> & {userId: string},
): Omit<SurveyWithParsedSchema, 'createdAt' | 'updatedAt' | 'id'> {
  let newTitle = input.title;
  let newDescription = input.description;

  if (!newTitle) {
    newTitle = 'Untitled Survey';
  }

  if (!newDescription) {
    newDescription = 'Untitled Survey';
  }

  return {
    userId: input.userId,
    is_published: false,
    schema: {
      title: newTitle,
      description: newDescription,
      elements: [],
      screens: {
        welcome: {
          message: null,
        },
        thank_you: {
          message: null,
        },
      },
      version: 1,
    },
  };
}
