"use client";
import { useState } from "react";
import { FaCheck, FaLink, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

/** Tombol share artikel: X, LinkedIn, copy link. */
export const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);

  const pageUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl())}`,
      "_blank",
      "noopener"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`,
      "_blank",
      "noopener"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  const btn =
    "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
        Share:
      </span>
      <button onClick={shareX} className={btn} aria-label="Share on X">
        <FaXTwitter />
      </button>
      <button
        onClick={shareLinkedIn}
        className={btn}
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn />
      </button>
      <button onClick={copyLink} className={btn} aria-label="Copy link">
        {copied ? <FaCheck className="text-green-500" /> : <FaLink />}
        {copied ? "Copied!" : ""}
      </button>
    </div>
  );
};
