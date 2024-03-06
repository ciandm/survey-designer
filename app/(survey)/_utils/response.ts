import {ResponseType, SurveyResponsesMap} from '@/types/survey';

export function transformResponsesMap(
  responsesMap: SurveyResponsesMap,
): ResponseType[] {
  return Object.entries(responsesMap).map(([questionId, response]) => {
    return {
      questionId,
      value: response.value,
      type: response.type,
    };
  });
}
