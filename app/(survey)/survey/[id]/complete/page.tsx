import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {ThankYouScreen} from '@/components/thank-you-screen';
import {ExpireCookie} from '@/survey/_components/expire-cookie';
import {COMPLETED_SURVEY_COOKIE} from '@/survey/_constants/survey';
import {getPublishedSurvey} from '@/survey/_lib/get-published-survey';
import {getSiteUrl} from '@/utils/hrefs';

type Props = {
  params: {
    id: string;
  };
};

const SurveyCompletedPage = async ({params}: Props) => {
  const surveyCookie = cookies().get(COMPLETED_SURVEY_COOKIE);

  if (!surveyCookie) {
    return redirect(getSiteUrl.surveyPage({surveyId: params.id}));
  }

  const survey = await getPublishedSurvey(params.id);

  if (!survey) {
    return redirect(getSiteUrl.surveyPage({surveyId: params.id}));
  }

  const message = survey.model.screens.thank_you[0]?.text;

  return (
    <ExpireCookie surveyId={params.id}>
      <ThankYouScreen title={message} />
    </ExpireCookie>
  );
};

export default SurveyCompletedPage;
