# Airdrop Strategy — $PROTECT

*Created: 2026-02-10*

---

## 1. Overview

**Total Airdrop Allocation:** 50,000,000 $PROTECT (5% of total supply)
**Distribution Model:** Tiered, task-based with anti-bot measures
**Timeline:** Pre-launch registration → Post-launch distribution

---

## 2. Airdrop Tiers & Conditions

### Tier 1: Base Airdrop (60% of airdrop pool = 30,000,000 $PROTECT)
**Per wallet:** 500–2,000 $PROTECT
**Max recipients:** ~20,000

**Required tasks (ALL must be completed):**
- [ ] Follow @ProtectToken on Twitter/X
- [ ] Retweet the pinned launch tweet
- [ ] Join Telegram group
- [ ] Submit wallet address via airdrop form

### Tier 2: Engagement Bonus (25% = 12,500,000 $PROTECT)
**Per wallet:** 1,000–5,000 $PROTECT (added on top of Tier 1)
**Max recipients:** ~5,000

**Additional tasks (at least 2 of 4):**
- [ ] Quote tweet with why you support $PROTECT (min 20 words, original)
- [ ] Create and post a $PROTECT meme (tagged @ProtectToken)
- [ ] Invite 3+ verified users to Telegram
- [ ] Share $PROTECT in a crypto Discord/community (screenshot proof)

### Tier 3: Champion Bonus (15% = 7,500,000 $PROTECT)
**Per wallet:** 5,000–25,000 $PROTECT
**Max recipients:** ~500

**Elite tasks (at least 1):**
- [ ] Create a $PROTECT video/thread (min 60 seconds / 5 tweets)
- [ ] Provide initial LP after launch (min 0.5 SOL)
- [ ] Verify personal donation to a child protection NGO (receipt required)
- [ ] Crypto influencer with 5K+ followers who posts about $PROTECT

---

## 3. Timeline

| Phase | Date | Activity |
|-------|------|----------|
| Registration Opens | T-14 days | Airdrop form goes live, social tasks begin |
| Registration Closes | T-2 days | No new entries accepted |
| Verification | T-2 to T-1 | Anti-bot screening, task verification |
| Token Launch | T-Day | Fair launch on pump.fun |
| Airdrop Distribution | T+3 to T+7 | Tokens sent to verified wallets |
| Unclaimed Reallocation | T+14 | Unclaimed tokens → donation wallet |

---

## 4. Anti-Bot Strategy

### 4.1 Registration Level
- **CAPTCHA** on airdrop form (hCaptcha)
- **Twitter account age** requirement: >30 days old
- **Twitter follower minimum:** >20 followers
- **Telegram account:** Must have username set, account >14 days old
- **One wallet per submission** (duplicate wallet = disqualified)

### 4.2 Behavioral Analysis
- **IP deduplication:** Max 2 submissions per IP address
- **Wallet clustering:** Flag wallets funded from the same source within 24h
- **Tweet analysis:** AI check for copy-paste tweets (must be original)
- **Temporal analysis:** Flag submissions completed in <60 seconds (bot speed)

### 4.3 Verification Layer
- **Random sampling:** 10% of submissions manually reviewed
- **Social proof cross-check:** Verify Twitter follows/RTs are still active at distribution time
- **Wallet activity check:** Wallet must have ≥1 SOL transaction history (not freshly created)

### 4.4 Post-Distribution
- **Sybil detection:** If multiple airdrop wallets send tokens to same destination within 48h, flag for future blacklisting
- **Sell lockout:** No explicit lock, but community shame mechanism (public dashboard showing airdrop wallet behavior)

---

## 5. Distribution Mechanics

### Technical Implementation
```
1. Collect verified wallet addresses → CSV
2. Calculate tier-based allocation per wallet
3. Use Solana batch transfer script (scripts/airdrop-distribute.mjs)
4. Send in batches of 50 wallets per transaction
5. Publish all TX hashes on website
```

### Cost Estimate
- ~0.000005 SOL per transfer
- 20,000 wallets × 0.000005 = ~0.1 SOL total gas
- Negligible cost

---

## 6. Referral Program (Bonus)

- Each verified participant gets a unique referral link
- For every 3 verified referrals: +500 $PROTECT bonus
- Max referral bonus: 5,000 $PROTECT per wallet
- Referral source tracked to prevent self-referral loops

---

## 7. Communication Plan

| When | What | Where |
|------|------|-------|
| T-14 | "Airdrop is LIVE" announcement | Twitter + Telegram |
| T-10 | Reminder + FAQ thread | Twitter |
| T-7 | "1 week left" + progress update | Twitter + Telegram |
| T-3 | "Last chance" + final reminder | All channels |
| T-1 | Registration closed, verification begins | Telegram |
| T+3 | Distribution begins, TX hashes shared | All channels |
| T+7 | "Airdrop complete" summary post | Twitter + Telegram |

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Bot farms claiming bulk airdrops | Multi-layer verification (see §4) |
| Airdrop recipients immediately dumping | Small per-wallet amounts limit sell pressure; community dashboard |
| Fake social engagement | Cross-verification at distribution time |
| Sybil attacks | Wallet clustering analysis + IP dedup |
| Form abuse / DDoS | Rate limiting + hCaptcha |
