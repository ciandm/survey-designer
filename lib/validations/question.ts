import zod from "zod";

const questionDesignSchema = zod.object({
  question: zod.string().min(1).max(255),
});
