import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(120),
  explanation: z
    .string()
    .min(20, { message: "Description should be at least 20 characters" })
    .max(1000),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "You should enter at least one tag" })
    .max(3),
});

export const AnswerSchema = z.object({
  answer: z
    .string()
    .min(20, { message: "Your answer should be at least 20 characters" }),
});
