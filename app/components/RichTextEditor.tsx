"use client";

import { useEffect, useRef } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder = "Write a description..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const currentValue = editorRef.current.innerHTML;
    if (currentValue !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const applyCommand = (command: string, valueArg?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    if (command === "createLink") {
      const link = window.prompt("Enter link URL", "https://");
      if (!link) return;
      document.execCommand(command, false, link);
    } else {
      document.execCommand(command, false, valueArg ?? undefined);
    }

    onChange(editor.innerHTML);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const toolbarButtons = [
    { label: "B", command: "bold", className: "font-bold" },
    { label: "I", command: "italic", className: "italic" },
    { label: "U", command: "underline", className: "underline" },
    { label: "• List", command: "insertUnorderedList" },
    { label: "1. List", command: "insertOrderedList" },
    { label: "Link", command: "createLink" },
    { label: "Clear", command: "removeFormat" },
  ];

  return (
    <div className="rich-text-editor border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyCommand(button.command)}
            className={`rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:border-[var(--primary)] hover:text-black transition ${button.className || ""}`}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="rich-text-editor-content min-h-[180px] px-4 py-3 text-gray-800 outline-none focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:cursor-text"
      />
    </div>
  );
}
