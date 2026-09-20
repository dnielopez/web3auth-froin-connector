# web3auth-froin-connector — Project Context

## What this is

A reusable, framework-light **React library** that centralizes Web3Auth-based
authentication and $FROIN (Solana SPL token) transaction logic, so any web
project in the FROIN ecosystem (Fravents, RiffWin, VWin, and future products)
can integrate wallet auth and $FROIN flows by installing one package instead
of re-implementing this logic per app.

This is being extracted from work already done for the Colosseum hackathon
("Crypto World's Fair", ends Oct 12, 2026) on the FROIN project — a
Solana-powered ecosystem connecting Fravents (ticketing), RiffWin
(participate-to-earn), and VWin (watch-to-earn) under one interoperable token.

## Who's building this

Dan — full-stack developer (10+ years, React/React Native/Node.js), based in
Bogotá, Colombia. Currently Senior Software Engineer at Wizeline; past roles
include Yum! Brands, NTWRK (live-stream commerce — real-time buyer/seller
interaction, closely analogous to RiffWin/VWin's live-event model), and Rokk3r;
built La Red Futbolera from scratch solo (mobile, web, backend). This is his
first hands-on Solana/blockchain build, layered on a decade of shipping
production JS applications. Building FROIN/Fravents solo (no cofounder,
no team yet).

## Why this library exists

- FROIN spans multiple separate web products (Fravents, RiffWin, VWin), all
  Next.js/React on the frontend. Wallet auth and $FROIN transfer logic would
  otherwise be duplicated and drift out of sync across repos.
- Centralizing it means: one place to fix bugs/security issues, one place to
  update when Web3Auth's SDK changes, and fast integration into new products
  as the ecosystem grows.
- Solo founder, hackathon timeline — cannot afford to hand-roll this three
  times across three codebases.

## Architecture decisions already made (do not relitigate these)

- **Wallet model**: non-custodial, embedded wallets via **Web3Auth (MetaMask
  Embedded Wallet SDK)** — MPC-based, no seed phrase shown to the user, no
  browser extension required. Chosen over Privy (too costly at scale) and
  Tatum (returns raw private keys — effectively custodial, rejected for
  security reasons).
- **Token**: $FROIN is a classic SPL token (standard Token Program). **No
  Token-2022 / Token Extensions** for this phase — explicit decision, do not
  suggest migrating.
- **RPC / indexing**: **Helius** — all reads (balances, token accounts, tx
  history) and webhooks go through Helius, never the public Solana RPC.
- **Gasless transactions**: **Kora**, self-hosted (Rust binary, `kora-cli`),
  currently running **locally** on devnet in **Free / fully sponsored mode**
  (the FROIN project currently pays SOL fees on the user's behalf; no
  $FROIN-denominated fee charged yet, but the `kora.toml` config is designed
  so that switching to fee collection in $FROIN later is a config change, not
  an architecture change). Kora is a separate JSON-RPC service this library
  talks to as a client (via `@solana/kora` or raw JSON-RPC) — this library
  never embeds Kora itself.
- **Smart contracts**: explicitly out of scope for this phase. No Anchor
  program yet (deferred to a future phase — vaults, staking, on-chain reward
  rules are NOT part of this library's current job).
- **Environment**: currently targeting Solana **devnet**. Mainnet migration is
  a future step, not assumed by this library's initial design.

## Required public API surface

The library must export at minimum:

- **`init(...params)`** — initializes the connector with Web3Auth credentials
  (`clientId`, network — `sapphire_devnet` for now) and FROIN-specific config
  (Helius RPC URL, $FROIN mint address, Kora endpoint URL). Should be called
  once per app, ideally via a React context/provider so downstream hooks/
  components can consume the initialized state.
- **`startAuth(...params)`** — handles login/signup: triggers the Web3Auth
  modal/flow, retrieves the user's Solana public key, and performs Sign-In
  With Solana (SIWS) — i.e. requests a signed message and hands the signature
  - public key back to the caller (the host app's backend does verification;
    this library does not own backend session state).
- **`createTransaction(...params)`** — builds and executes a $FROIN transfer
  from one wallet to another. Given the gasless architecture, this needs to
  support the two-step partial-signature flow: build the transaction with
  Kora's pubkey as fee payer, get the user's partial signature via Web3Auth,
  then hand off to the host app's backend (or directly to Kora, TBD in
  implementation) to complete co-signing and broadcast.
- **`depositRewards(...params)`** — triggers a $FROIN airdrop/reward payout
  (e.g. after a watch-to-earn dynamic). This is a treasury-to-user transfer,
  sponsored via Kora, NOT something the end-user wallet signs — open design
  question for the dev plan: this call should route through the host app's
  backend (which holds treasury authority), never hold or use treasury keys
  client-side under any circumstances.

## Non-negotiable security constraints

- **Never** embed or transmit private keys, seed phrases, or treasury
  authority in this library's client-side code. Web3Auth keeps key material
  in MPC; treasury/reward-issuing authority belongs server-side in host apps,
  never in this package.
- Kora integration must always go through the fee-payer co-signing model —
  this library never becomes a fee payer itself and never holds SOL for fees.
  (this integration is already working and lives in other repos,
  the idea is connect them thorught endpoint requests)
- All RPC calls go through Helius (configurable endpoint), never a public
  Solana RPC endpoint, to avoid rate-limiting and to keep indexing consistent
  across consuming apps.

## Target consumers (initial)

- Fravents (ticketing)
- RiffWin (participate-to-earn)
- VWin (watch-to-earn, live video)

All are Next.js apps today; the library should assume a React environment but
avoid Next.js-specific APIs so it stays portable if a consuming app changes
frameworks later.

## Explicitly out of scope for v1

- Anchor/on-chain program interaction of any kind
- Token-2022 support
- Non-Solana chains
- Mainnet-specific configuration/hardening (revisit when the ecosystem moves
  off devnet)
- Backend session management, JWT issuance, or database persistence — this
  library hands the host app's backend what it needs (signed message,
  signature, public key) and stops there

## What I need from a dev plan

A step-by-step build plan for `web3auth-froin-connector` covering: package
structure (monorepo-friendly? plain npm package?), the React provider/hook
design for `init`/`startAuth`, the transaction-building module for
`createTransaction`/`depositRewards` (including how the partial-signature +
Kora hand-off is structured), a local testing strategy against devnet, and a
versioning/publish plan (private npm registry vs. GitHub Packages vs. public
npm) so Fravents/RiffWin/VWin can consume it as a real dependency rather than
copy-pasted code.
