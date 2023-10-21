import React from "react";
import { Prisma, Survey } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DeleteSurveyButton } from "./delete-survey-button";

export const SurveyCard = ({
  survey,
}: {
  survey: Prisma.SurveyGetPayload<{
    include: {
      questions: true;
    };
  }>;
}) => {
  const questionCount = survey.questions.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.name}</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        </CardDescription>
      </CardHeader>
      <CardContent>{questionCount} questions</CardContent>
      <CardFooter className="justify-between">
        <DeleteSurveyButton survey={survey} />
        <Button variant="default" asChild>
          <Link href={`/survey/creator/${survey.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
