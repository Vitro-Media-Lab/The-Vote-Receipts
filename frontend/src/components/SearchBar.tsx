"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { BillReceipt, LawmakerProfile, CompanyProfile, SearchResult } from "@/types";
import { buildLawmakerIndex, buildCompanyIndex, searchAll } from "@/lib/search-index";

interface SearchBarProps {
  bills: BillReceipt[];
  onSelectBill: (billId: string) => void;
  onSelectLawmaker: (profile: LawmakerProfile) => void;
  onSelectCompany: (profile: CompanyProfile) => void;
}

function CategoryHeader({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-receipt-muted bg-receipt-highlight border-b border-receipt-border">
      {label}
    </div>
  );
}

export default function SearchBar({
  bills,
  onSelectBill,
  onSelectLawmaker,
  onSelectCompany,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lawmakerIndex = useMemo(() => buildLawmakerIndex(bills), [bills]);
  const companyIndex = useMemo(() => buildCompanyIndex(bills), [bills]);

  const results = useMemo(
    () => searchAll(query, bills, lawmakerIndex, companyIndex),
    [query, bills, lawmakerIndex, companyIndex],
  );

  const hasResults =
    results.bills.length > 0 ||
    results.lawmakers.length > 0 ||
    results.companies.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(result: SearchResult) {
    setQuery("");
    setOpen(false);
    if (result.type === "bill") {
      onSelectBill(result.bill_id);
    } else if (result.type === "lawmaker") {
      const profile = lawmakerIndex.get(result.bioguide_id);
      if (profile) onSelectLawmaker(profile);
    } else {
      const profile = companyIndex.get(result.name);
      if (profile) onSelectCompany(profile);
    }
  }

  return (
    <div ref={ref} className="relative max-w-lg w-full mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search bills, lawmakers, or companies..."
        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      />

      {open && hasResults && (
        <div
          className="absolute top-full left-0 right-0 z-50 bg-receipt-bg text-receipt-text border border-receipt-border shadow-2xl max-h-80 overflow-y-auto"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {results.bills.length > 0 && (
            <>
              <CategoryHeader label="Bills" />
              {results.bills.map((r) => (
                <button
                  key={r.type === "bill" ? r.bill_id : ""}
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-receipt-highlight cursor-pointer border-b border-receipt-border/50"
                >
                  {r.label}
                </button>
              ))}
            </>
          )}

          {results.lawmakers.length > 0 && (
            <>
              <CategoryHeader label="Lawmakers" />
              {results.lawmakers.map((r) => (
                <button
                  key={r.type === "lawmaker" ? r.bioguide_id : ""}
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-receipt-highlight cursor-pointer border-b border-receipt-border/50"
                >
                  {r.label}
                </button>
              ))}
            </>
          )}

          {results.companies.length > 0 && (
            <>
              <CategoryHeader label="Companies" />
              {results.companies.map((r) => (
                <button
                  key={r.type === "company" ? r.name : ""}
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-receipt-highlight cursor-pointer border-b border-receipt-border/50"
                >
                  {r.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
