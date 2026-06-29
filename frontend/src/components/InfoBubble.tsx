"use client";

import { useState, useRef, useEffect } from "react";

export default function InfoBubble() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-4 right-4 z-50" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {open && (
        <div className="absolute bottom-12 right-0 w-72 p-4 text-xs leading-relaxed text-neutral-400 bg-neutral-900/95 border border-neutral-700 backdrop-blur-sm">
          <p>
            This tool displays publicly available data from LDA.gov, OpenFEC,
            and Congress.gov. Lobbying expenditures are split evenly across
            bills cited in each filing. PAC donation totals reflect full FEC
            history, not a single election cycle. Company-to-PAC matching uses
            fuzzy name resolution and may miss some connections. All figures
            can undercount but never overcount. Correlation between donations
            and votes does not imply causation. This is a transparency tool,
            not an accusation.
          </p>
          <a
            href="https://buy.stripe.com/00weVe3fXfbu9Ru4wRgQE00"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 py-2 text-center text-xs font-bold uppercase tracking-wider border border-neutral-600 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            [ FUND THE AUDIT, NOT THE POLITICIANS ]
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center text-sm font-bold border border-neutral-600 bg-neutral-900/90 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-colors backdrop-blur-sm cursor-pointer"
      >
        ?
      </button>
    </div>
  );
}
