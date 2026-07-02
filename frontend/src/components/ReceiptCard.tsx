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
      className="text-receipt-text rounded-sm shadow-lg max-w-lg w-full mx-auto"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Torn top edge */}
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="w-full h-4 block">
        <polygon
          points="0,16 200,16 200,8 195,0 190,8 185,0 180,8 175,0 170,8 165,0 160,8 155,0 150,8 145,0 140,8 135,0 130,8 125,0 120,8 115,0 110,8 105,0 100,8 95,0 90,8 85,0 80,8 75,0 70,8 65,0 60,8 55,0 50,8 45,0 40,8 35,0 30,8 25,0 20,8 15,0 10,8 5,0 0,8"
          fill="#fffef5"
        />
      </svg>

      <div
        className="bg-receipt-bg px-5 pb-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 28px)",
        }}
      >
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
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="w-full h-4 block">
        <polygon
          points="0,0 200,0 200,8 195,16 190,8 185,16 180,8 175,16 170,8 165,16 160,8 155,16 150,8 145,16 140,8 135,16 130,8 125,16 120,8 115,16 110,8 105,16 100,8 95,16 90,8 85,16 80,8 75,16 70,8 65,16 60,8 55,16 50,8 45,16 40,8 35,16 30,8 25,16 20,8 15,16 10,8 5,16 0,8"
          fill="#fffef5"
        />
      </svg>
    </article>
  );
}
