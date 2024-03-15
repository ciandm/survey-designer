import {
  StoreElements,
  StoreSurvey,
} from '@/survey-designer/_store/designer-store/designer-store.types';
import {ParsedModelType} from '@/types/survey';
import {sortFieldChoices} from '@/utils/element';

type BuildSurveyModelArgs = {
  survey: StoreSurvey;
  elements: StoreElements;
};

type BuildSurveyModelOptions = {
  shouldSortChoices?: boolean;
};

export const buildSurveyModel = (
  {survey, elements}: BuildSurveyModelArgs,
  {shouldSortChoices = false}: BuildSurveyModelOptions = {},
): ParsedModelType => {
  const {fields, screens} = elements;
  const {title = '', description, version} = survey;

  return {
    title,
    description,
    version,
    fields: fields._entities.map((id) => {
      if (shouldSortChoices && fields.data[id].properties.sort_order) {
        return sortFieldChoices(fields.data[id]);
      }
      return fields.data[id];
    }),
    screens: {
      welcome: screens.welcome._entities.map((id) => screens.welcome.data[id]),
      thank_you: screens.thank_you._entities.map(
        (id) => screens.thank_you.data[id],
      ),
    },
  };
};
