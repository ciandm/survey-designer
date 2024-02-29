import {getUser} from '@/lib/auth';
import {db} from '@/lib/db';

export async function getResponses(id: string) {
  const {user} = await getUser();

  if (!user) {
    return [];
  }

  const responses = await db.surveyResult.findMany({
    where: {
      surveyId: id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return responses ?? [];
}
