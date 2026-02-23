/**
 * $PROTECT Token — Token-2022 with TransferFee
 * 
 * Features:
 * - Token-2022 (Token Extensions Program)
 * - 1.5% TransferFee on all transfers
 * - Fee harvested to donation wallet
 * - Total Supply: 1,000,000,000
 * 
 * Run: node 2-create-token-2022.mjs
 * Requires: devnet-wallet.json (from 1-create-wallet.mjs)
 */

import {
  Connection, Keypair, SystemProgram, Transaction,
  sendAndConfirmTransaction, PublicKey
} from '@solana/web3.js';
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  getMintLen,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createMintToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import fs from 'fs';

const DEVNET_URL = 'https://api.devnet.solana.com';
const TOTAL_SUPPLY = 1_000_000_000;
const DECIMALS = 9;

// TransferFee: 1.5% = 150 basis points (max 100 tokens per tx)
const FEE_BASIS_POINTS = 150; // 1.5%
const MAX_FEE = BigInt(100) * BigInt(10 ** DECIMALS); // 100 tokens max fee

async function main() {
  // Load wallet
  const keyData = JSON.parse(fs.readFileSync('./devnet-wallet.json', 'utf8'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(keyData));
  const connection = new Connection(DEVNET_URL, 'confirmed');

  console.log(`👛 지갑: ${wallet.publicKey.toBase58()}`);
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`💰 잔액: ${balance / 1e9} SOL\n`);

  if (balance < 0.5e9) {
    console.log('❌ SOL 부족! 최소 0.5 SOL 필요. 에어드롭 받으세요:');
    console.log('   solana airdrop 2 --url devnet');
    return;
  }

  // Generate mint keypair
  const mintKeypair = Keypair.generate();
  console.log(`🪙 토큰 민트 주소: ${mintKeypair.publicKey.toBase58()}`);

  // Calculate space for Token-2022 mint with TransferFee extension
  const mintLen = getMintLen([ExtensionType.TransferFeeConfig]);
  const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);

  console.log(`📐 민트 계정 크기: ${mintLen} bytes`);
  console.log(`💵 렌트: ${mintRent / 1e9} SOL\n`);

  // Transaction 1: Create mint with TransferFee
  console.log('🔨 Token-2022 민트 생성 중 (TransferFee 1.5%)...');
  
  const tx1 = new Transaction().add(
    // Create account for mint
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports: mintRent,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    // Initialize TransferFee config
    createInitializeTransferFeeConfigInstruction(
      mintKeypair.publicKey,
      wallet.publicKey,       // transferFeeConfigAuthority
      wallet.publicKey,       // withdrawWithheldAuthority (collects fees)
      FEE_BASIS_POINTS,       // 1.5%
      MAX_FEE,                // max fee per transfer
      TOKEN_2022_PROGRAM_ID,
    ),
    // Initialize mint
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      DECIMALS,
      wallet.publicKey,       // mintAuthority
      wallet.publicKey,       // freezeAuthority
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const sig1 = await sendAndConfirmTransaction(connection, tx1, [wallet, mintKeypair]);
  console.log(`✅ 민트 생성 완료! TX: ${sig1}\n`);

  // Transaction 2: Create token account & mint supply
  console.log('📦 토큰 계정 생성 중...');
  
  const ata = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const tx2 = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      ata,
      wallet.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  );

  const sig2 = await sendAndConfirmTransaction(connection, tx2, [wallet]);
  console.log(`✅ 토큰 계정: ${ata.toBase58()}\n`);

  // Mint total supply
  console.log(`🖨️  ${TOTAL_SUPPLY.toLocaleString()} $PROTECT 발행 중...`);
  
  const tx3 = new Transaction().add(
    createMintToInstruction(
      mintKeypair.publicKey,
      ata,
      wallet.publicKey,
      BigInt(TOTAL_SUPPLY) * BigInt(10 ** DECIMALS),
      [],
      TOKEN_2022_PROGRAM_ID,
    ),
  );

  const sig3 = await sendAndConfirmTransaction(connection, tx3, [wallet]);
  console.log(`✅ 발행 완료! TX: ${sig3}\n`);

  // Save results
  const result = {
    network: 'devnet',
    program: 'Token-2022',
    token: '$PROTECT',
    mint: mintKeypair.publicKey.toBase58(),
    tokenAccount: ata.toBase58(),
    wallet: wallet.publicKey.toBase58(),
    totalSupply: TOTAL_SUPPLY,
    decimals: DECIMALS,
    transferFee: {
      basisPoints: FEE_BASIS_POINTS,
      percentage: '1.5%',
      maxFeeTokens: 100,
      feeAuthority: wallet.publicKey.toBase58(),
      withdrawAuthority: wallet.publicKey.toBase58(),
    },
    createdAt: new Date().toISOString(),
    txSignatures: { createMint: sig1, createATA: sig2, mintSupply: sig3 },
  };

  fs.writeFileSync('./token-2022-info.json', JSON.stringify(result, null, 2));
  
  console.log('📋 결과 요약:');
  console.log(`   민트: ${result.mint}`);
  console.log(`   계정: ${result.tokenAccount}`);
  console.log(`   수수료: ${result.transferFee.percentage} (최대 ${result.transferFee.maxFeeTokens} 토큰/tx)`);
  console.log(`   총 발행: ${TOTAL_SUPPLY.toLocaleString()} $PROTECT`);
  console.log(`\n💾 token-2022-info.json에 저장됨`);
  console.log(`\n🔗 Explorer: https://explorer.solana.com/address/${result.mint}?cluster=devnet`);
}

main().catch(console.error);
