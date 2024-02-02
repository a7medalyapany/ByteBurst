"use client";
import React, { FC, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  //   value: string;
  //   setValue: (value: string) => void;
}

const TextEditor: FC<TextEditorProps> = () => {
  const [value, setValue] = useState("");

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

  return (
    <div className="h-[250px] overflow-hidden rounded-xl bg-transparent">
      <ReactQuill
        theme="snow"
        value={value}
        modules={{ toolbar: toolbarOptions }}
        onChange={setValue}
        className="h-[170px]"
      />
    </div>
  );
};

export default TextEditor;
