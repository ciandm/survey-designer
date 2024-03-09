import {PrismaClient} from '@prisma/client';
import fakeSurveys from './data.json';

const SEED_USER_ID = process.env.SEED_USER_ID;

const db = new PrismaClient();

async function seedDatabase() {
  try {
    if (!SEED_USER_ID) {
      throw new Error('SEED_USER_ID is not set');
    }

    await db.surveyResult.deleteMany();
    await db.survey.deleteMany();

    for (const surveyData of fakeSurveys) {
      const title = surveyData.title;
      await db.survey.create({
        data: {
          userId: SEED_USER_ID,
          id: surveyData.id,
          model: surveyData,
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
