import { KeyRound, LockKeyhole } from "lucide-react";

export function LedgerPlaceholder() {
  return (
    <div className="project-placeholder ledger-placeholder" aria-hidden="true">
      <div className="api-request-node">
        <span>POST</span>
        <code>/transfer</code>
      </div>

      <div className="transfer-line">
        <span />
        <i>atomic</i>
        <span />
      </div>

      <div className="ledger-sheet">
        <div className="ledger-row ledger-row--header">
          <span>ENTRY</span>
          <span>TYPE</span>
          <span>VALUE</span>
        </div>
        <div className="ledger-row">
          <span>8F2A</span>
          <strong>DEBIT</strong>
          <b>−250</b>
        </div>
        <div className="ledger-row">
          <span>8F2B</span>
          <strong>CREDIT</strong>
          <b>+250</b>
        </div>
        <div className="ledger-balance">
          <span>BALANCED</span>
          <i>0.00</i>
        </div>
      </div>

      <div className="ledger-security">
        <span><KeyRound /> IDEM-7K2</span>
        <span><LockKeyhole /> JWT</span>
      </div>
    </div>
  );
}
