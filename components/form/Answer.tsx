"use client";
import * as z from "zod";
import { FC, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from "../ui/button";

interface AnswerProps {}

const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });

const Answer: FC<AnswerProps> = () => {
  const [value, setValue] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = (data: z.infer<typeof AnswerSchema>) => {
    console.log(data);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold">
          Your Answer <span className="text-red-500">*</span>
        </h4>

        <Button className="gap-1.5 rounded-md border px-4 py-2.5 shadow-none">
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
            onClick={() => {}}
          />
          Generate an AI answer
        </Button>
      </div>
      <Form {...form}>
        <form
          action=""
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <div className="h-[250px] overflow-hidden bg-transparent">
                    <DynamicQuill
                      theme="snow"
                      value={value}
                      modules={{ toolbar: toolbarOptions }}
                      onChange={(value) => {
                        setValue(value);
                        form.setValue("answer", value);
                      }}
                      className="h-[170px]"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
