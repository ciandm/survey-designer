'use server';

import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {surveySchema} from '@/lib/validations/survey';

const schema = z.object({
  surveyId: z.string(),
});

export async function publishSurvey(
  surveyId: string,
  action: 'publish' | 'unpublish',
) {
  const validatedField = schema.safeParse({surveyId});

  if (!validatedField.success) {
    throw new Error('Invalid survey id');
  }

  const {surveyId: id} = validatedField.data;

  const survey = await db.survey.update({
    where: {id},
    data: {is_published: action === 'publish' ? true : false},
  });
  return {
    is_published: survey.is_published,
  };
}

export async function deleteSurvey(surveyId: string) {
  const validatedField = schema.safeParse({surveyId});

  if (!validatedField.success) {
    throw new Error('Invalid survey id');
  }

  const {surveyId: id} = validatedField.data;

  await db.survey.delete({
    where: {id},
  });

  return {
    success: true,
  };
}

export async function duplicateSurvey(surveyId: string) {
  const {user} = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const validatedField = schema.safeParse({surveyId});

  if (!validatedField.success) {
    throw new Error('Invalid survey id');
  }

  const {surveyId: id} = validatedField.data;

  const survey = await db.survey.findUnique({
    where: {id},
  });

  if (!survey) {
    throw new Error('Survey not found');
  }

  const parsedSchema = surveySchema.safeParse(survey.schema);

  if (!parsedSchema.success) {
    throw new Error('Invalid survey schema');
  }

  const {
    data: {elements, title},
  } = parsedSchema;

  const duplicatedSurvey = await db.survey.create({
    data: {
      userId: user.id,
      schema: {
        title: title ? `${title} (Copy)` : 'Untitled Survey (Copy)',
        elements: elements.map((element) => ({
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
        })),
      },
    },
  });

  return {
    surveyId: duplicatedSurvey.id,
  };
}
