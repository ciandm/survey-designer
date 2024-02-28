import {PrismaClient} from '@prisma/client';
import fakeSurveys from './data.json';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    await prisma.surveyResult.deleteMany();
    await prisma.survey.deleteMany();

    for (const surveyData of fakeSurveys) {
      const title = surveyData.title;
      await prisma.survey.create({
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
    await prisma.$disconnect();
  }
}

seedDatabase();
