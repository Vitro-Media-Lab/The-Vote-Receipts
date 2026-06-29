import type {
  BillReceipt,
  LawmakerProfile,
  CompanyProfile,
  SearchResult,
} from "@/types";

export function buildLawmakerIndex(bills: BillReceipt[]): Map<string, LawmakerProfile> {
  const index = new Map<string, LawmakerProfile>();

  for (const bill of bills) {
    const process = (receipts: BillReceipt["vote_receipts_yes"], voteLabel: "YEA" | "NAY") => {
      for (const vr of receipts) {
        let profile = index.get(vr.bioguide_id);
        if (!profile) {
          profile = {
            bioguide_id: vr.bioguide_id,
            name: vr.lawmaker_name,
            party: vr.party || "",
            state: vr.state || "",
            total_pac_cash: 0,
            bills: [],
          };
          index.set(vr.bioguide_id, profile);
        }
        profile.total_pac_cash += vr.cash_received_from_pac;
        profile.bills.push({
          bill_id: bill.bill_id,
          bill_label: bill.bill_label,
          bill_title: bill.bill_title,
          vote_cast: voteLabel,
          cash_received_from_pac: vr.cash_received_from_pac,
          contributing_pacs: vr.contributing_pacs,
        });
      }
    };
    process(bill.vote_receipts_yes, "YEA");
    process(bill.vote_receipts_no, "NAY");
  }

  return index;
}

export function buildCompanyIndex(bills: BillReceipt[]): Map<string, CompanyProfile> {
  const index = new Map<string, CompanyProfile>();

  for (const bill of bills) {
    const voteStatus = bill.vote.status === "found"
      ? (bill.vote.total_yes ?? 0) > (bill.vote.total_no ?? 0) ? "PASSED" : "FAILED"
      : "NO ROLL CALL";

    const yeaPacCompanies = new Map<string, Set<string>>();
    for (const vr of bill.vote_receipts_yes) {
      for (const pac of vr.contributing_pacs) {
        if (!yeaPacCompanies.has(pac.company)) yeaPacCompanies.set(pac.company, new Set());
        yeaPacCompanies.get(pac.company)!.add(vr.bioguide_id);
      }
    }

    const nayPacCompanies = new Map<string, Set<string>>();
    for (const vr of bill.vote_receipts_no) {
      for (const pac of vr.contributing_pacs) {
        if (!nayPacCompanies.has(pac.company)) nayPacCompanies.set(pac.company, new Set());
        nayPacCompanies.get(pac.company)!.add(vr.bioguide_id);
      }
    }

    const allCompanies = new Set<string>();
    for (const e of bill.top_funding_entities) allCompanies.add(e.name);
    for (const c of yeaPacCompanies.keys()) allCompanies.add(c);
    for (const c of nayPacCompanies.keys()) allCompanies.add(c);

    for (const companyName of allCompanies) {
      let profile = index.get(companyName);
      if (!profile) {
        profile = {
          name: companyName,
          total_lobbying: 0,
          total_pac: 0,
          total_capital: 0,
          bills: [],
        };
        index.set(companyName, profile);
      }

      const lobbyEntry = bill.top_funding_entities.find((e) => e.name === companyName);
      const lobbySpent = lobbyEntry?.total_spent ?? 0;
      const yeaBought = yeaPacCompanies.get(companyName)?.size ?? 0;
      const nayBought = nayPacCompanies.get(companyName)?.size ?? 0;

      let billPacCash = 0;
      for (const receipts of [bill.vote_receipts_yes, bill.vote_receipts_no]) {
        for (const vr of receipts) {
          for (const pac of vr.contributing_pacs) {
            if (pac.company === companyName) billPacCash += pac.amount;
          }
        }
      }

      profile.total_lobbying += lobbySpent;
      profile.bills.push({
        bill_id: bill.bill_id,
        bill_label: bill.bill_label,
        bill_title: bill.bill_title,
        lobbying_spent: lobbySpent,
        pac_cash: billPacCash,
        vote_status: voteStatus,
        yea_bought: yeaBought,
        nay_bought: nayBought,
      });
    }
  }

  for (const profile of index.values()) {
    let pacTotal = 0;
    for (const bill of profile.bills) {
      // not double-counted — this is per-company per-bill
    }
    // Compute PAC total from source bills
    for (const b of bills) {
      for (const receipts of [b.vote_receipts_yes, b.vote_receipts_no]) {
        for (const vr of receipts) {
          for (const pac of vr.contributing_pacs) {
            if (pac.company === profile.name) {
              pacTotal += pac.amount;
            }
          }
        }
      }
    }
    profile.total_pac = pacTotal;
    profile.total_capital = profile.total_lobbying + pacTotal;
    profile.bills.sort((a, b) => b.lobbying_spent - a.lobbying_spent);
  }

  return index;
}

const BRAND_ALIASES: Record<string, string[]> = {
  google: ["google", "alphabet", "google client services"],
  meta: ["meta", "facebook", "meta platforms"],
  amazon: ["amazon", "amazon.com", "aws"],
  microsoft: ["microsoft"],
  apple: ["apple"],
  exxon: ["exxon", "exxonmobil", "exxon mobil"],
  chevron: ["chevron"],
  jpmorgan: ["jpmorgan", "jp morgan", "chase"],
  pfizer: ["pfizer"],
  disney: ["disney", "walt disney"],
  att: ["at&t", "att"],
  comcast: ["comcast", "nbcuniversal"],
  verizon: ["verizon"],
  boeing: ["boeing"],
  lockheed: ["lockheed", "lockheed martin"],
  raytheon: ["raytheon", "rtx"],
};

function expandQuery(q: string): string[] {
  const terms = [q];
  for (const aliases of Object.values(BRAND_ALIASES)) {
    if (aliases.some((a) => a.includes(q) || q.includes(a))) {
      for (const a of aliases) {
        if (!terms.includes(a)) terms.push(a);
      }
    }
  }
  return terms;
}

function matchesAny(haystack: string, terms: string[]): boolean {
  return terms.some((t) => haystack.includes(t));
}

export function searchAll(
  query: string,
  bills: BillReceipt[],
  lawmakers: Map<string, LawmakerProfile>,
  companies: Map<string, CompanyProfile>,
): { bills: SearchResult[]; lawmakers: SearchResult[]; companies: SearchResult[] } {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return { bills: [], lawmakers: [], companies: [] };

  const terms = expandQuery(q);

  const billResults: SearchResult[] = [];
  for (const b of bills) {
    const haystack = `${b.bill_id} ${b.bill_label} ${b.bill_title ?? ""}`.toLowerCase();
    if (matchesAny(haystack, terms)) {
      billResults.push({
        type: "bill",
        bill_id: b.bill_id,
        label: `${b.bill_label}${b.bill_title ? " — " + b.bill_title.slice(0, 50) : ""}`,
      });
    }
    if (billResults.length >= 5) break;
  }

  const lawmakerResults: SearchResult[] = [];
  for (const lm of lawmakers.values()) {
    if (matchesAny(lm.name.toLowerCase(), terms)) {
      lawmakerResults.push({
        type: "lawmaker",
        bioguide_id: lm.bioguide_id,
        label: lm.name,
      });
    }
    if (lawmakerResults.length >= 5) break;
  }

  const companyResults: SearchResult[] = [];
  for (const co of companies.values()) {
    if (matchesAny(co.name.toLowerCase(), terms)) {
      companyResults.push({
        type: "company",
        name: co.name,
        label: co.name,
      });
    }
    if (companyResults.length >= 5) break;
  }

  return { bills: billResults, lawmakers: lawmakerResults, companies: companyResults };
}
