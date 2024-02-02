"use client";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";

interface QuestionProps {}

const Question: FC<QuestionProps> = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-muted-foreground/70">
                Question Title
                <span className="text-foreground"> *</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="paragraph-regular min-h-[56px] border bg-accent"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-muted-foreground">
                A clear and concise title that reflects the question content.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-muted-foreground/70">
                Detailed explanation of your problem
                <span className="text-foreground"> *</span>
              </FormLabel>
              <FormControl className="mt-3.5">{/* TODO */}</FormControl>
              <FormDescription className="body-regular mt-2.5 text-muted-foreground">
                Feel free and explain your problem in detail, including any
                error messages, and what you have tried so far.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-muted-foreground/70">
                Tags
                <span className="text-foreground"> *</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="paragraph-regular min-h-[56px] border bg-accent"
                  placeholder="e.g. react, typescript, javascript"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-muted-foreground">
                Add up to 3 tags to describe what your question is about.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Question;
