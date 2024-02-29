import {PrismaClient} from '@prisma/client';
import fakeSurveys from './data.json';

const db = new PrismaClient();

async function seedDatabase() {
  try {
    await db.surveyResult.deleteMany();
    await db.survey.deleteMany();

    for (const surveyData of fakeSurveys) {
      const title = surveyData.title;
      await db.survey.create({
        data: {
          userId: '1',
          id: surveyData.id,
          schema: surveyData,
          is_published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`Created survey: ${title}`);
    }
  } catch (error) {
    console.error(`Error seeding the database: ${error}`);
  } finally {
    await db.$disconnect();
  }
}

seedDatabase();
