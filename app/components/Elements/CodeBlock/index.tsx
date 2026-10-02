"use client";
import { useState } from "react";
import { highlight } from "sugar-high";
import { FaCheck, FaCopy } from "react-icons/fa";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** Blok kode dengan syntax highlighting + tombol copy. */
export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 not-prose">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-white dark:bg-gray-900 text-sm leading-relaxed">
        <code
          dangerouslySetInnerHTML={{
            __html: highlight(code, language ? { lang: language } : undefined),
          }}
        />
      </pre>
    </div>
  );
};
