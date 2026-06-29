import type { LawmakerProfile } from "@/types";
import ReceiptShell from "./ReceiptShell";
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
  return <div className="border-b border-dashed border-receipt-border my-2" />;
}

export default function LawmakerReceipt({
  profile,
  onClose,
}: {
  profile: LawmakerProfile;
  onClose: () => void;
}) {
  const yeaBills = profile.bills.filter((b) => b.vote_cast === "YEA");
  const nayBills = profile.bills.filter((b) => b.vote_cast === "NAY");

  return (
    <ReceiptShell>
      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-xs text-receipt-muted tracking-widest uppercase">
          The Vote Receipts
        </div>
        <div className="text-xs text-receipt-muted tracking-wider uppercase mt-1">
          Lawmaker Accountability Ledger
        </div>
        <div className="text-2xl font-black tracking-tight mt-2">
          {profile.name}
        </div>
        <div className="text-xs text-receipt-muted mt-1">
          {[profile.party, profile.state, profile.bioguide_id].filter(Boolean).join(" · ")}
        </div>
      </div>

      <DottedLine />

      {/* Summary */}
      <div className="space-y-1 my-2">
        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL PAC CASH RECEIVED</span>
          <span>{usd(profile.total_pac_cash)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">BILLS VOTED ON</span>
          <span>{profile.bills.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">VOTED YEA</span>
          <span>{yeaBills.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">VOTED NAY</span>
          <span>{nayBills.length}</span>
        </div>
      </div>

      <DottedLine />

      {/* Line items */}
      <div className="my-2">
        <div className="text-xs text-receipt-muted uppercase tracking-wider mb-2">
          Vote-by-Vote Breakdown
        </div>
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {profile.bills
            .sort((a, b) => b.cash_received_from_pac - a.cash_received_from_pac)
            .map((entry) => (
              <div key={`${entry.bill_id}-${entry.vote_cast}`} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">{entry.bill_id}</span>
                  <span
                    className={
                      entry.vote_cast === "YEA"
                        ? "text-receipt-green font-bold"
                        : "text-receipt-accent font-bold"
                    }
                  >
                    {entry.vote_cast}
                  </span>
                </div>
                {entry.bill_title && (
                  <div className="text-xs text-receipt-muted italic truncate">
                    {entry.bill_title}
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-receipt-muted">PAC CASH</span>
                  <span>{usd(entry.cash_received_from_pac)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <DottedLine />

      <ShareButton hash={`lawmaker/${profile.bioguide_id}`} />

      <DottedLine />

      {/* Footer */}
      <div className="text-center text-xs text-receipt-muted mt-2 space-y-0.5">
        <div>DATA: LDA.GOV / OPENFEC / CONGRESS.GOV</div>
        <div>NO EDITORIAL SELECTION. RANKED BY CAPITAL.</div>
      </div>

      <DottedLine />

      <button
        onClick={onClose}
        className="w-full text-center text-sm py-2 text-receipt-accent hover:underline cursor-pointer"
      >
        CLOSE LEDGER
      </button>
    </ReceiptShell>
  );
}
