import {v4 as uuid} from 'uuid';
import {SurveyWithParsedModelType} from '@/types/survey';
import {buildNewElementHelper, buildNewScreenHelper} from '@/utils/survey';

export const demoSurvey: SurveyWithParsedModelType = {
  createdAt: new Date(),
  id: 'demo',
  is_published: false,
  model: {
    elements: [
      buildNewElementHelper('short_text', {
        text: 'What is your name?',
        description: 'Please enter your full name',
        validations: {required: true},
      }),
    ],
    screens: {
      welcome: [buildNewScreenHelper('welcome_screen')],
      thank_you: [],
    },
    title: 'Demo survey',
    version: 1,
    description: 'This is a demo survey',
  },
  updatedAt: new Date(),
  userId: 'demo',
};
