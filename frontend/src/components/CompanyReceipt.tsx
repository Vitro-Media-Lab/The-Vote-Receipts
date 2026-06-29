import type { CompanyProfile } from "@/types";
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

export default function CompanyReceipt({
  profile,
  onClose,
}: {
  profile: CompanyProfile;
  onClose: () => void;
}) {
  const passedBills = profile.bills.filter((b) => b.vote_status === "PASSED");
  const totalYeaBought = profile.bills.reduce((s, b) => s + b.yea_bought, 0);
  const totalNayBought = profile.bills.reduce((s, b) => s + b.nay_bought, 0);

  return (
    <ReceiptShell>
      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-xs text-receipt-muted tracking-widest uppercase">
          The Vote Receipts
        </div>
        <div className="text-xs text-receipt-muted tracking-wider uppercase mt-1">
          Corporate ROI Ledger
        </div>
        <div className="text-lg font-black tracking-tight mt-2 px-2 leading-snug">
          {profile.name}
        </div>
      </div>

      <DottedLine />

      {/* Summary */}
      <div className="space-y-1 my-2">
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">LOBBYING DEPLOYED</span>
          <span className="font-bold">{usd(profile.total_lobbying)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">PAC CASH DEPLOYED</span>
          <span className="font-bold">{usd(profile.total_pac)}</span>
        </div>
        <DottedLine />
        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL CAPITAL DEPLOYED</span>
          <span>{usd(profile.total_capital)}</span>
        </div>
      </div>

      <DottedLine />

      {/* Outcome stats */}
      <div className="space-y-1 my-2">
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">BILLS TARGETED</span>
          <span>{profile.bills.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">BILLS PASSED</span>
          <span>{passedBills.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">YEA VOTES INFLUENCED</span>
          <span className="text-receipt-green font-bold">{totalYeaBought}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-receipt-muted">NAY VOTES INFLUENCED</span>
          <span className="text-receipt-accent font-bold">{totalNayBought}</span>
        </div>
      </div>

      <DottedLine />

      {/* Legislative track record */}
      <div className="my-2">
        <div className="text-xs text-receipt-muted uppercase tracking-wider mb-2">
          Legislative Track Record
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {profile.bills.map((entry) => (
            <div key={entry.bill_id} className="text-sm">
              <div className="flex justify-between">
                <span className="font-bold">{entry.bill_id}</span>
                <span
                  className={
                    entry.vote_status === "PASSED"
                      ? "text-receipt-green font-bold"
                      : "text-receipt-muted"
                  }
                >
                  {entry.vote_status}
                </span>
              </div>
              {entry.bill_title && (
                <div className="text-xs text-receipt-muted italic truncate">
                  {entry.bill_title}
                </div>
              )}
              {entry.lobbying_spent > 0 && (
                <div className="flex justify-between text-xs pl-3 mt-0.5">
                  <span className="text-receipt-muted">LOBBYING OUTLAY</span>
                  <span>{usd(entry.lobbying_spent)}</span>
                </div>
              )}
              {entry.pac_cash > 0 && (
                <div className="flex justify-between text-xs pl-3">
                  <span className="text-receipt-muted">PAC CASH</span>
                  <span>{usd(entry.pac_cash)}</span>
                </div>
              )}
              {(entry.yea_bought > 0 || entry.nay_bought > 0) && (
                <div className="text-xs pl-3 mt-0.5">
                  <span className="text-receipt-muted">INFLUENCED: </span>
                  <span className="text-receipt-green font-bold">
                    {entry.yea_bought} YEA
                  </span>
                  <span className="text-receipt-muted"> / </span>
                  <span className="text-receipt-accent font-bold">
                    {entry.nay_bought} NAY
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DottedLine />

      <ShareButton hash={`company/${encodeURIComponent(profile.name)}`} />

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
