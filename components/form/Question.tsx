"use client";
import React, { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

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
import TextEditor from "../TextEditor";
import { Badge } from "../ui/badge";

interface QuestionProps {}

const type = "create";

const Question: FC<QuestionProps> = () => {
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }

        if (
          field.value.length < 3 &&
          !field.value.includes(tagValue as never)
        ) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          form.setError("tags", {
            type: "required",
            message: "You can only add up to 3 tags",
          });
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

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
    setisSubmitting(true);

    try {
      // 1. create a new question
      // 2. update a question
      // navigate to home
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setisSubmitting(false);
    }

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
              <FormControl className="mt-3.5">
                <TextEditor />
              </FormControl>
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
                <>
                  <Input
                    className="paragraph-regular min-h-[56px] border bg-accent"
                    placeholder="e.g. react, typescript, javascript"
                    onKeyDown={(e) => {
                      handleInputKeyDown(e, field);
                    }}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          onClick={() => handleTagRemove(tag, field)}
                          className="subtle-medium flex items-center justify-center gap-2 rounded-md border-none bg-muted/50 px-4 py-2 capitalize text-foreground"
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-muted-foreground">
                Add up to 3 tags to describe what your question is about.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>{type === "create" ? "Posting..." : "Updating..."}</>
          ) : (
            <>{type === "create" ? "Ask a Question" : "Update"}</>
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default Question;
