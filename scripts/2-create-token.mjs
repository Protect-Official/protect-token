/**
 * Step 2: $PROTECT 토큰 생성 (테스트넷)
 * 
 * 실행 전 1-create-wallet.mjs 먼저 실행 필요
 */

import { Keypair, Connection } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';

const DEVNET_URL = 'https://api.devnet.solana.com';
const TOTAL_SUPPLY = 1_000_000_000; // 10억 개
const DECIMALS = 9;

async function main() {
  // 지갑 로드
  const keyData = JSON.parse(fs.readFileSync('./devnet-wallet.json', 'utf8'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(keyData));
  const connection = new Connection(DEVNET_URL, 'confirmed');

  console.log(`👛 지갑: ${wallet.publicKey.toBase58()}`);
  
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`💰 잔액: ${balance / 1e9} SOL\n`);

  if (balance < 0.1e9) {
    console.log('❌ SOL 부족! 1-create-wallet.mjs를 먼저 실행하세요.');
    return;
  }

  // 토큰 민트 생성
  console.log('🪙 $PROTECT 토큰 생성 중...');
  const mint = await createMint(
    connection,
    wallet,        // 수수료 지불자
    wallet.publicKey,  // 민트 권한
    wallet.publicKey,  // 동결 권한 (나중에 제거 가능)
    DECIMALS
  );
  console.log(`✅ 토큰 민트 주소: ${mint.toBase58()}`);

  // 토큰 계정 생성
  console.log('📦 토큰 계정 생성 중...');
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );
  console.log(`✅ 토큰 계정: ${tokenAccount.address.toBase58()}`);

  // 토큰 발행
  console.log(`🖨️  ${TOTAL_SUPPLY.toLocaleString()} $PROTECT 발행 중...`);
  await mintTo(
    connection,
    wallet,
    mint,
    tokenAccount.address,
    wallet,
    BigInt(TOTAL_SUPPLY) * BigInt(10 ** DECIMALS)
  );
  console.log('✅ 발행 완료!\n');

  // 결과 저장
  const result = {
    network: 'devnet',
    token: 'PROTECT',
    mint: mint.toBase58(),
    tokenAccount: tokenAccount.address.toBase58(),
    wallet: wallet.publicKey.toBase58(),
    totalSupply: TOTAL_SUPPLY,
    decimals: DECIMALS,
    createdAt: new Date().toISOString()
  };
  
  fs.writeFileSync('./token-info.json', JSON.stringify(result, null, 2));
  console.log('📋 결과 요약:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n💾 token-info.json에 저장됨');
  console.log('\n🔗 Solana Explorer에서 확인:');
  console.log(`https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`);
}

main().catch(console.error);
