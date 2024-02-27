export const getSiteUrl = {
  homePage: () => '/home',
  designerPage: ({surveyId}: {surveyId: string}) =>
    `/editor/${surveyId}/designer`,
  previewPage: ({surveyId}: {surveyId: string}) =>
    `/editor/${surveyId}/preview`,
  responsesPage: ({surveyId}: {surveyId: string}) =>
    `/editor/${surveyId}/response`,
  createPage: () => '/create',
  surveyPage: ({surveyId}: {surveyId: string}) => `/survey/${surveyId}`,
};
