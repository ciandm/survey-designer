import {SurveyWithParsedModelType} from '@/types/survey';
import {buildNewFieldHelper, buildNewScreenHelper} from '@/utils/survey';

export const demoSurvey: SurveyWithParsedModelType = {
  createdAt: new Date(),
  id: 'demo',
  is_published: false,
  model: {
    fields: [
      buildNewFieldHelper('short_text', {
        text: 'What is your name?',
        description: 'Please enter your full name',
        validations: {required: true},
      }),
    ],
    screens: {
      welcome: [buildNewScreenHelper('welcome_screen')],
      thank_you: [buildNewScreenHelper('thank_you_screen')],
    },
    title: 'Demo survey',
    version: 1,
    description: 'This is a demo survey',
  },
  updatedAt: new Date(),
  userId: 'demo',
};
