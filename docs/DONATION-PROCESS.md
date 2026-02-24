# Donation Process

**How $PROTECT turns trading into real-world impact.**

## Overview

$PROTECT uses Solana Token-2022's TransferFee extension to automatically collect a 1.5% fee on every token transfer. One-third of this fee (0.5%) goes directly to child protection organizations.

This document explains the full process from fee collection to NGO donation.

## Fee Flow

```
Token Transfer (any DEX/wallet)
        │
        ▼
1.5% TransferFee (protocol-enforced)
        │
        ├── 0.5% → Donation Wallet
        ├── 0.5% → Team Operations Wallet
        └── 0.5% → LP Reinvestment Wallet
```

## Step-by-Step Process

### 1. Automatic Fee Collection
Every time $PROTECT tokens are transferred, the Token-2022 protocol withholds 1.5% as a fee. This happens automatically — no manual intervention, no way to bypass it.

### 2. Fee Harvesting (Monthly)
On the 1st of each month, the team executes a `harvestWithheldTokensToMint` transaction to collect accumulated fees from all token accounts into the mint.

### 3. Fee Distribution
After harvesting, fees are withdrawn and split three ways:
- **Donation wallet**: 0.5% of all fees
- **Operations wallet**: 0.5% of all fees
- **LP wallet**: 0.5% of all fees

All distribution transactions are recorded on-chain.

### 4. NGO Donation (Quarterly)
Every quarter (January, April, July, October), the donation wallet funds are converted to fiat and sent to partner NGOs:

| Organization | Focus Area | Website |
|-------------|-----------|---------|
| **Thorn** | Technology to fight child sexual abuse | [thorn.org](https://thorn.org) |
| **NCMEC** | Missing & exploited children clearinghouse | [missingkids.org](https://missingkids.org) |
| **Polaris Project** | Human trafficking hotline & data | [polarisproject.org](https://polarisproject.org) |

Distribution among NGOs is equal (33.3% each) unless modified by community governance vote.

### 5. Transparency & Verification

**On-Chain:**
- All fee collection transactions visible on [Solana Explorer](https://explorer.solana.com)
- Donation wallet address published on website
- Every transfer from donation wallet to exchanges/fiat ramps is traceable

**Off-Chain:**
- Donation receipts from NGOs published on Twitter and website
- Quarterly donation reports with:
  - Total fees collected
  - Amount donated
  - NGO receipts/confirmations
  - On-chain transaction hashes

## Wallet Addresses

All wallet addresses will be published at mainnet launch:

| Wallet | Purpose | Multisig |
|--------|---------|----------|
| Donation Wallet | Holds 0.5% fees for NGO donations | Planned (Squads) |
| Operations Wallet | Team expenses, development | Planned (Squads) |
| LP Wallet | Liquidity pool reinvestment | Planned (Squads) |

## Governance (Phase 3+)

After launch, token holders will be able to:
- Vote on which NGOs receive donations (via Snapshot)
- Propose new NGO partners
- Review and approve quarterly donation reports
- Suggest changes to fee distribution ratios

## Timeline

| Phase | Donation Process |
|-------|-----------------|
| Phase 1 (Pre-launch) | No fees yet — building infrastructure |
| Phase 2 (Launch) | Manual quarterly donations, full transparency |
| Phase 3 (Growth) | Community governance over donation recipients |
| Phase 4 (Scale) | Automated on-chain donation pipeline, DAO-controlled |

## FAQ

**Q: Can the team steal the donation funds?**
A: All wallet addresses are public and every transaction is on-chain. Planned multisig (Squads Protocol) will require multiple signatures for any transfer.

**Q: What if an NGO refuses the donation?**
A: Funds will be redirected to the remaining partner NGOs or a community-voted alternative.

**Q: How do you convert crypto to fiat for NGOs?**
A: Through regulated exchanges and fiat on-ramps. Transaction records are published.

**Q: Can the 1.5% fee be changed?**
A: The TransferFee is set at token creation. While Token-2022 allows fee updates, we plan to renounce the fee authority post-launch to make it permanent.

---

**Every trade protects a child. Verify it yourself. 🛡️**
