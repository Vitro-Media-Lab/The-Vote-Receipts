"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { BillReceipt, LawmakerProfile, CompanyProfile } from "@/types";
import { buildLawmakerIndex, buildCompanyIndex } from "@/lib/search-index";
import ReceiptCard from "./ReceiptCard";
import SearchBar from "./SearchBar";
import LawmakerReceipt from "./LawmakerReceipt";
import CompanyReceipt from "./CompanyReceipt";

const INITIAL_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const MAX_LEADERBOARD = 50;

type ActiveView =
  | { type: "leaderboard" }
  | { type: "lawmaker"; profile: LawmakerProfile }
  | { type: "company"; profile: CompanyProfile };

export default function Leaderboard({ bills }: { bills: BillReceipt[] }) {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const [activeView, setActiveView] = useState<ActiveView>({ type: "leaderboard" });
  const billRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const topRef = useRef<HTMLDivElement>(null);

  const leaderboardBills = useMemo(() => bills.slice(0, MAX_LEADERBOARD), [bills]);
  const lawmakerIndex = useMemo(() => buildLawmakerIndex(bills), [bills]);
  const companyIndex = useMemo(() => buildCompanyIndex(bills), [bills]);
  const hasMore = visible < leaderboardBills.length;

  const navigateRef = useRef<(hash: string) => void>(() => {});
  navigateRef.current = (hash: string) => {
    if (!hash) return;
    const [type, ...rest] = hash.split("/");
    const id = decodeURIComponent(rest.join("/"));

    if (type === "bill") {
      const idx = leaderboardBills.findIndex((b) => b.bill_id === id);
      if (idx >= 0) {
        setActiveView({ type: "leaderboard" });
        setVisible((v) => Math.max(v, idx + 1));
        setTimeout(() => {
          billRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else if (type === "lawmaker") {
      const profile = lawmakerIndex.get(id);
      if (profile) setActiveView({ type: "lawmaker", profile });
    } else if (type === "company") {
      const profile = companyIndex.get(id);
      if (profile) setActiveView({ type: "company", profile });
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) navigateRef.current(hash);

    function onHashChange() {
      navigateRef.current(window.location.hash.slice(1));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (activeView.type !== "leaderboard") {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeView]);

  function setHash(hash: string) {
    window.history.pushState(null, "", `#${hash}`);
  }

  function handleSelectBill(billId: string) {
    setHash(`bill/${billId}`);
    setActiveView({ type: "leaderboard" });
    const idx = leaderboardBills.findIndex((b) => b.bill_id === billId);
    if (idx >= 0) {
      setVisible((v) => Math.max(v, idx + 1));
    }
    setTimeout(() => {
      billRefs.current.get(billId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function handleSelectLawmaker(profile: LawmakerProfile) {
    setHash(`lawmaker/${profile.bioguide_id}`);
    setActiveView({ type: "lawmaker", profile });
  }

  function handleSelectCompany(profile: CompanyProfile) {
    setHash(`company/${encodeURIComponent(profile.name)}`);
    setActiveView({ type: "company", profile });
  }

  function handleClose() {
    window.history.pushState(null, "", window.location.pathname);
    setActiveView({ type: "leaderboard" });
  }

  return (
    <section className="px-4 pb-8">
      <div ref={topRef} className="mb-8">
        <SearchBar
          bills={bills}
          onSelectBill={handleSelectBill}
          onSelectLawmaker={handleSelectLawmaker}
          onSelectCompany={handleSelectCompany}
        />
      </div>

      {activeView.type === "lawmaker" && (
        <div className="mb-8">
          <LawmakerReceipt profile={activeView.profile} onClose={handleClose} />
        </div>
      )}

      {activeView.type === "company" && (
        <div className="mb-8">
          <CompanyReceipt profile={activeView.profile} onClose={handleClose} />
        </div>
      )}

      <div className="space-y-8">
        {leaderboardBills.slice(0, visible).map((bill) => (
          <div
            key={bill.bill_id}
            ref={(el) => {
              if (el) billRefs.current.set(bill.bill_id, el);
            }}
          >
            <ReceiptCard bill={bill} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() =>
              setVisible((v) => Math.min(v + LOAD_MORE_COUNT, leaderboardBills.length))
            }
            className="px-6 py-3 text-sm font-bold uppercase tracking-wider border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            Load {Math.min(LOAD_MORE_COUNT, leaderboardBills.length - visible)} More
            Receipts
          </button>
          <div className="text-xs text-neutral-600 mt-2">
            Showing {visible}{" "}of 50 &middot; Search to explore all 50 tracked bills
          </div>
        </div>
      )}
    </section>
  );
}
