"use client";

import { useState } from "react";

export default function ShareButton({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleShare}
      className="w-full text-center text-xs py-1.5 text-receipt-muted hover:text-receipt-text cursor-pointer tracking-wider uppercase transition-colors"
    >
      {copied ? "LINK COPIED TO CLIPBOARD" : "SHARE THIS RECEIPT"}
    </button>
  );
}
