export const getSiteUrl = {
  homePage: () => '/',
  dashboardPage: () => '/home',
  designerPage: ({surveyId}: {surveyId: string}) => `/create/${surveyId}`,
  previewPage: ({surveyId}: {surveyId: string}) => `/create/${surveyId}`,
  responsesPage: ({surveyId}: {surveyId: string}) => `/create/${surveyId}`,
  createPage: () => '/create',
  surveyPage: ({surveyId}: {surveyId: string}) => `/survey/${surveyId}`,
  completePage: ({surveyId}: {surveyId: string}) =>
    `/survey/${surveyId}/complete`,
  loginPage: () => '/login',
  signUpPage: () => '/register',
  demoPage: () => '/demo',
};
