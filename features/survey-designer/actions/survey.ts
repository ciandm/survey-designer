'use server';

import {z} from 'zod';
import prisma from '@/prisma/client';

const publishSurveySchema = z.object({
  surveyId: z.string(),
});

export async function publishSurvey(
  surveyId: string,
  action: 'publish' | 'unpublish',
) {
  const validatedField = publishSurveySchema.safeParse({surveyId});

  if (!validatedField.success) {
    throw new Error('Invalid survey id');
  }

  const {surveyId: id} = validatedField.data;

  const survey = await prisma.survey.update({
    where: {id},
    data: {is_published: action === 'publish' ? true : false},
  });
  return {
    is_published: survey.is_published,
  };
}
