export interface ContributingPac {
  committee_id: string;
  company: string;
  amount: number;
}

export interface VoteReceipt {
  lawmaker_name: string;
  bioguide_id: string;
  party: string;
  state: string;
  cash_received_from_pac: number;
  contributing_pacs: ContributingPac[];
  vote_cast: string;
}

export interface FundingEntity {
  name: string;
  total_spent: number;
}

export interface VoteMeta {
  status: string;
  congress?: number;
  chamber?: string;
  roll_number?: number;
  source_url?: string;
  total_yes?: number;
  total_no?: number;
}

export interface BillReceipt {
  rank: number;
  bill_id: string;
  bill_label: string;
  bill_title: string | null;
  bill_url: string;
  total_lobbying_outlay: number;
  total_pac_donations_yes: number;
  total_pac_donations_no: number;
  total_pac_donations: number;
  total_financial_footprint: number;
  filing_count: number;
  unique_clients: number;
  top_funding_companies: string[];
  top_funding_entities: FundingEntity[];
  vote: VoteMeta;
  vote_receipts_yes: VoteReceipt[];
  vote_receipts_no: VoteReceipt[];
}

export interface LawmakerBillEntry {
  bill_id: string;
  bill_label: string;
  bill_title: string | null;
  vote_cast: "YEA" | "NAY";
  cash_received_from_pac: number;
  contributing_pacs: ContributingPac[];
}

export interface LawmakerProfile {
  bioguide_id: string;
  name: string;
  party: string;
  state: string;
  total_pac_cash: number;
  bills: LawmakerBillEntry[];
}

export interface CompanyBillEntry {
  bill_id: string;
  bill_label: string;
  bill_title: string | null;
  lobbying_spent: number;
  pac_cash: number;
  vote_status: string;
  yea_bought: number;
  nay_bought: number;
}

export interface CompanyProfile {
  name: string;
  total_lobbying: number;
  total_pac: number;
  total_capital: number;
  bills: CompanyBillEntry[];
}

export type SearchResult =
  | { type: "bill"; bill_id: string; label: string }
  | { type: "lawmaker"; bioguide_id: string; label: string }
  | { type: "company"; name: string; label: string };

export interface PipelineData {
  metadata: {
    generated_at: string;
    pipeline_duration_seconds: number;
    congress: number;
    sweep_years: number[];
    bills_analyzed: number;
    bills_errored: string[];
  };
  leaderboard: BillReceipt[];
}
