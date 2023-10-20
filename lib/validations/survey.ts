import zod from "zod";

export const deleteSurveySchema = zod.object({
  id: zod.number(),
});
