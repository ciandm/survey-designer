import {v4 as uuidv4} from 'uuid';
import {ElementSchemaType} from '@/types/element';
import {CreateSurveyInputType, SurveyWithParsedModelType} from '@/types/survey';

function duplicateElements(elements: ElementSchemaType[]) {
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
  survey: SurveyWithParsedModelType,
  input: Omit<CreateSurveyInputType, 'duplicatedFrom'>,
): Omit<SurveyWithParsedModelType, 'createdAt' | 'updatedAt' | 'id'> {
  const {model} = survey;
  let newTitle = input.title;
  let newDescription = input.description;

  if (!newTitle) {
    newTitle = survey.model.title
      ? `${survey.model.title} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  if (!newDescription) {
    newDescription = model.description
      ? `${model.description} (Copy)`
      : 'Untitled Survey (Copy)';
  }

  return {
    is_published: false,
    userId: survey.userId,
    model: {
      ...survey.model,
      title: newTitle,
      description: newDescription,
      elements: duplicateElements(survey.model.elements),
    },
  };
}

export function generateNewSurvey(
  input: Omit<CreateSurveyInputType, 'duplicatedFrom'> & {userId: string},
): Omit<SurveyWithParsedModelType, 'createdAt' | 'updatedAt' | 'id'> {
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
    model: {
      title: newTitle,
      description: newDescription,
      elements: [],
      screens: {
        welcome: [],
        thank_you: [],
      },
      version: 1,
    },
  };
}
