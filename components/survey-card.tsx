import React from "react";
import { Survey } from "@prisma/client";
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

export const SurveyCard = ({ survey }: { survey: Survey }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.name}</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        </CardDescription>
      </CardHeader>
      <CardContent>3 questions</CardContent>
      <CardFooter className="justify-between">
        <DeleteSurveyButton />
        <Button variant="default" asChild>
          <Link href={`/surveys/${survey.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
