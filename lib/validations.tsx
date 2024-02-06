import * as z from "zod";

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title should be at least 5 characters" })
    .max(120, { message: "Title cannot exceed 120 characters" }),
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

const isValidUrl = (value: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const ProfileSchema = z.object({
  portfolio: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          if (!isValidUrl(value)) {
            throw new Error("Portfolio must be a valid URL");
          }
        }
        return true;
      },
      { message: "Portfolio must be a valid URL" }
    ),
  location: z
    .string()
    .max(20, { message: "Location cannot exceed 20 characters" })
    .optional(),
  bio: z
    .string()
    .max(150, { message: "Bio cannot exceed 150 characters" })
    .optional(),
});
