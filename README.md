# web3auth-froin-connector

A reusable, framework-light React library that centralizes Web3Auth-based authentication and $FROIN (Solana SPL token) transaction logic.

## Aim

This project provides a single, unified package so any web project in the FROIN ecosystem (Fravents, RiffWin, VWin, and future products) can integrate wallet authentication and $FROIN flows without re-implementing this logic per app. By centralizing it, we have one place to fix bugs, update SDKs, and integrate into new products.

## Description

The library provides components and hooks for React applications to interact with:
- **Web3Auth**: Non-custodial, embedded wallets using MetaMask Embedded Wallet SDK via MPC (no seed phrases shown to users, no extensions required).
- **Helius**: RPC endpoint for all reads (balances, token accounts, tx history).
- **Kora**: Gasless transactions through a self-hosted JSON-RPC service (fee payer co-signing).
- **$FROIN Token**: Standard Solana SPL token (not Token-2022).

## Key Features

- `init`: Initializes the connector with Web3Auth credentials and FROIN-specific config.
- `startAuth`: Handles login/signup via Web3Auth and Sign-In With Solana (SIWS).
- `createTransaction`: Builds and executes a gasless $FROIN transfer (two-step partial-signature flow with Kora).
- `depositRewards`: Triggers a treasury-to-user $FROIN airdrop/reward payout.

## Security Constraints

- Private keys, seed phrases, or treasury authority are **never** held or transmitted by this client-side code.
- Kora integration strictly uses a fee-payer co-signing model.
- All RPC calls route through Helius to avoid public rate-limiting and ensure indexing consistency.

## Target Consumers
This package is built primarily for:
- **Fravents** (ticketing)
- **RiffWin** (participate-to-earn)
- **VWin** (watch-to-earn, live video)

Currently targets Solana **devnet**.

## Development & Usage

Currently built for a React/Next.js environment but avoids Next.js-specific APIs to remain portable.

*(Further instructions for local development, testing, and consumption will be added here as the package structure is finalized).*