import {v4 as uuid} from 'uuid';
import {SurveyWithParsedModelType} from '@/types/survey';

export const demoSurvey: SurveyWithParsedModelType = {
  createdAt: new Date(),
  id: 'demo',
  is_published: false,
  model: {
    elements: [
      {
        id: uuid(),
        ref: uuid(),
        type: 'short_text',
        text: 'Your first question',
        description: 'This is a short text question',
        validations: {required: true},
        properties: {},
      },
    ],
    screens: {
      welcome: [
        {
          type: 'welcome_screen',
          id: uuid(),
          text: 'Welcome to the demo survey!',
          description: 'Welcome',
          properties: {button_label: 'Start survey'},
        },
      ],
      thank_you: [],
    },
    title: 'Demo survey',
    version: 1,
    description: 'This is a demo survey',
  },
  updatedAt: new Date(),
  userId: 'demo',
};
