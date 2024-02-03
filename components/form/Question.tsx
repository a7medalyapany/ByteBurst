"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
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
import { Badge } from "../ui/badge";
import { createQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";

interface QuestionProps {
  mongoUserId: string;
}

const type = "create";
const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });

const Question: FC<QuestionProps> = ({ mongoUserId }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

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
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setisSubmitting(true);

    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      });

      router.push("/");
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
                <div className="h-[250px] overflow-hidden bg-transparent">
                  <DynamicQuill
                    theme="snow"
                    value={value}
                    modules={{ toolbar: toolbarOptions }}
                    onChange={(value) => {
                      setValue(value);
                      form.setValue("explanation", value);
                    }}
                    className="h-[170px]"
                  />
                </div>
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
        </Button>
      </form>
    </Form>
  );
};

export default Question;
