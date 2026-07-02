import type { PipelineData } from "@/types";
import Leaderboard from "@/components/Leaderboard";
import InfoBubble from "@/components/InfoBubble";
import fs from "fs";
import path from "path";

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function Home() {
  const filePath = path.join(process.cwd(), "public", "master_receipts_hub.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: PipelineData = JSON.parse(raw);

  const totalLobby = data.leaderboard.reduce(
    (s, b) => s + b.total_lobbying_outlay,
    0
  );
  const totalPac = data.leaderboard.reduce(
    (s, b) => s + b.total_pac_donations,
    0
  );
  const totalYes = data.leaderboard.reduce(
    (s, b) => s + b.vote_receipts_yes.length,
    0
  );
  const totalNo = data.leaderboard.reduce(
    (s, b) => s + b.vote_receipts_no.length,
    0
  );
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          THE VOTE RECEIPTS
        </h1>
        <p className="text-lg text-neutral-400 mt-3 max-w-2xl mx-auto">
          An autonomous discovery engine. No editorial selection.
          <br />
          The top 50 bills ranked purely by corporate
          lobbying volume.
        </p>

        {/* Aggregate stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <div>
            <div className="text-3xl font-black text-white">
              {usd(totalLobby)}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
              Lobbying Tracked
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {usd(totalPac)}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
              PAC $ to Voters
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {totalYes}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
              Voted Yea + Took $
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">
              {totalNo}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
              Voted Nay + Took $
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-600 mt-8">
          {data.metadata.congress}th Congress &middot; Years:{" "}
          {data.metadata.sweep_years[0]}&ndash;{data.metadata.sweep_years[data.metadata.sweep_years.length - 1]}
        </div>
      </header>

      {/* Receipt stack */}
      <Leaderboard bills={data.leaderboard} />

      {/* Fund the Audit */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <a
          href="https://buy.stripe.com/00weVe3fXfbu9Ru4wRgQE00"
          target="_blank"
          rel="noopener noreferrer"
          className="block py-3 text-center text-xs font-bold uppercase tracking-wider border border-neutral-600 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-colors"
        >
          [ FUND THE AUDIT, NOT THE POLITICIANS ]
        </a>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-neutral-600 border-t border-neutral-800 space-y-1">
        <div>
          Data sources: LDA.gov &middot; OpenFEC &middot; Congress.gov &middot;
          @unitedstates/congress-legislators
        </div>
        <div>
          Ranked by capital volume. No human curation.
        </div>
        <div className="mt-4 text-neutral-500">
          &copy; 2026 The Vote Receipts. All rights reserved.
        </div>
      </footer>

      <InfoBubble />
    </main>
  );
}
