import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@web3auth/modal', '@web3auth/base', '@web3auth/solana-provider', '@solana/web3.js'],
});
