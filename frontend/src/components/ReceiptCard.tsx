"use client";

import { useState } from "react";
import type { BillReceipt } from "@/types";
import ShareButton from "./ShareButton";

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function DottedLine() {
  return (
    <div className="border-b border-dashed border-receipt-border my-2" />
  );
}

function LineItem({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-sm ${bold ? "font-bold" : ""}`}
    >
      <span className="truncate mr-4">{label}</span>
      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
}

export default function ReceiptCard({ bill }: { bill: BillReceipt }) {
  const [expandedYes, setExpandedYes] = useState(false);
  const [expandedNo, setExpandedNo] = useState(false);
  const hasVote = bill.vote.status === "found";
  const yesCount = bill.vote_receipts_yes.length;
  const noCount = bill.vote_receipts_no.length;

  return (
    <article
      className="bg-receipt-bg text-receipt-text rounded-sm shadow-lg max-w-lg w-full mx-auto"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 28px)",
      }}
    >
      {/* Torn top edge */}
      <div
        className="h-3 w-full"
        style={{
          background: "var(--color-receipt-bg)",
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 Q5,0 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5 T110,5 T120,5 T130,5 T140,5 T150,5 T160,5 T170,5 T180,5 T190,5 T200,5 V10 H0 Z' fill='white'/%3E%3C/svg%3E\")",
          maskSize: "200px 10px",
          maskRepeat: "repeat-x",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 Q5,0 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5 T110,5 T120,5 T130,5 T140,5 T150,5 T160,5 T170,5 T180,5 T190,5 T200,5 V10 H0 Z' fill='white'/%3E%3C/svg%3E\")",
          WebkitMaskSize: "200px 10px",
          WebkitMaskRepeat: "repeat-x",
        }}
      />

      <div className="px-5 pb-5">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-xs text-receipt-muted tracking-widest uppercase">
            The Vote Receipts
          </div>
          <div className="text-2xl font-black tracking-tight mt-1">
            {bill.bill_label}
          </div>
          {bill.bill_title && (
            <div className="text-xs text-receipt-text mt-1 italic px-4 leading-snug">
              {bill.bill_title}
            </div>
          )}
          <div className="text-xs text-receipt-muted mt-1">
            #{bill.rank} by lobbying volume
          </div>
        </div>

        <DottedLine />

        {/* Financial summary */}
        <div className="space-y-1 my-2">
          <LineItem
            label="LOBBYING OUTLAY"
            value={usd(bill.total_lobbying_outlay)}
          />
          <LineItem
            label="PAC CASH TO YEA VOTERS"
            value={usd(bill.total_pac_donations_yes)}
          />
          <LineItem
            label="PAC CASH TO NAY VOTERS"
            value={usd(bill.total_pac_donations_no)}
          />
          <DottedLine />
          <LineItem
            label="FINANCIAL FOOTPRINT"
            value={usd(bill.total_financial_footprint)}
            bold
          />
        </div>

        <DottedLine />

        {/* Corporate funders */}
        <div className="my-2">
          <div className="text-xs text-receipt-muted uppercase tracking-wider mb-1">
            Top Corporate Funders
          </div>
          {bill.top_funding_entities.slice(0, 5).map((e) => (
            <LineItem
              key={e.name}
              label={e.name}
              value={usd(e.total_spent)}
            />
          ))}
        </div>

        <DottedLine />

        {/* Vote status */}
        <div className="my-2 text-sm">
          <div className="flex justify-between">
            <span className="text-receipt-muted">VOTE STATUS</span>
            <span className={hasVote ? "text-receipt-green font-bold" : "text-receipt-muted"}>
              {hasVote
                ? (bill.vote.total_yes ?? 0) > 0
                  ? `PASSED (${bill.vote.total_yes} YEA)`
                  : "PASSED (VOICE VOTE)"
                : "NO ROLL CALL"}
            </span>
          </div>
          {hasVote && bill.vote.chamber && (
            <div className="flex justify-between mt-1">
              <span className="text-receipt-muted">CHAMBER</span>
              <span>{bill.vote.chamber.toUpperCase()}</span>
            </div>
          )}
          <div className="flex justify-between mt-1">
            <span className="text-receipt-muted">CLIENTS ON FILE</span>
            <span>{bill.unique_clients.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-receipt-muted">LDA FILINGS</span>
            <span>{bill.filing_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Vote receipts — YES */}
        {yesCount > 0 && (
          <>
            <DottedLine />
            <button
              onClick={() => setExpandedYes(!expandedYes)}
              className="w-full text-center text-sm py-2 text-receipt-green hover:underline cursor-pointer"
            >
              {expandedYes
                ? "HIDE YEA RECEIPTS"
                : `VIEW ${yesCount} VOTED YEA + TOOK PAC $`}
            </button>

            {expandedYes && (
              <div className="space-y-0.5 mt-1 max-h-96 overflow-y-auto">
                <div className="flex justify-between text-xs text-receipt-muted uppercase tracking-wider mb-1">
                  <span>Lawmaker (YEA)</span>
                  <span>PAC $ Recv</span>
                </div>
                {bill.vote_receipts_yes.map((vr) => (
                  <div
                    key={vr.bioguide_id}
                    className="flex justify-between text-sm py-0.5"
                  >
                    <span className="truncate mr-3">
                      {vr.lawmaker_name}
                      {vr.party && <span className="text-receipt-muted text-xs"> ({vr.party}-{vr.state})</span>}
                    </span>
                    <span className="whitespace-nowrap text-receipt-green font-bold">
                      {usd(vr.cash_received_from_pac)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Vote receipts — NAY */}
        {noCount > 0 && (
          <>
            <DottedLine />
            <button
              onClick={() => setExpandedNo(!expandedNo)}
              className="w-full text-center text-sm py-2 text-receipt-accent hover:underline cursor-pointer"
            >
              {expandedNo
                ? "HIDE NAY RECEIPTS"
                : `VIEW ${noCount} VOTED NAY + TOOK PAC $`}
            </button>

            {expandedNo && (
              <div className="space-y-0.5 mt-1 max-h-96 overflow-y-auto">
                <div className="flex justify-between text-xs text-receipt-muted uppercase tracking-wider mb-1">
                  <span>Lawmaker (NAY)</span>
                  <span>PAC $ Recv</span>
                </div>
                {bill.vote_receipts_no.map((vr) => (
                  <div
                    key={vr.bioguide_id}
                    className="flex justify-between text-sm py-0.5"
                  >
                    <span className="truncate mr-3">
                      {vr.lawmaker_name}
                      {vr.party && <span className="text-receipt-muted text-xs"> ({vr.party}-{vr.state})</span>}
                    </span>
                    <span className="whitespace-nowrap text-receipt-accent font-bold">
                      {usd(vr.cash_received_from_pac)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <DottedLine />

        <ShareButton hash={`bill/${bill.bill_id}`} />

        <DottedLine />

        {/* Footer */}
        <div className="text-center text-xs text-receipt-muted mt-2 space-y-0.5">
          <div>DATA: LDA.GOV / OPENFEC / CONGRESS.GOV</div>
          <div>NO EDITORIAL SELECTION. RANKED BY CAPITAL.</div>
        </div>
      </div>

      {/* Torn bottom edge */}
      <div
        className="h-3 w-full"
        style={{
          background: "var(--color-receipt-bg)",
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 H200 V5 Q195,10 190,5 T180,5 T170,5 T160,5 T150,5 T140,5 T130,5 T120,5 T110,5 T100,5 T90,5 T80,5 T70,5 T60,5 T50,5 T40,5 T30,5 T20,5 T10,5 T0,5 Z' fill='white'/%3E%3C/svg%3E\")",
          maskSize: "200px 10px",
          maskRepeat: "repeat-x",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 H200 V5 Q195,10 190,5 T180,5 T170,5 T160,5 T150,5 T140,5 T130,5 T120,5 T110,5 T100,5 T90,5 T80,5 T70,5 T60,5 T50,5 T40,5 T30,5 T20,5 T10,5 T0,5 Z' fill='white'/%3E%3C/svg%3E\")",
          WebkitMaskSize: "200px 10px",
          WebkitMaskRepeat: "repeat-x",
        }}
      />
    </article>
  );
}
