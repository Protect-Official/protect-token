/**
 * Step 1: 테스트넷 지갑 생성 + Airdrop
 * 
 * ⚠️ 이건 테스트넷 전용 지갑입니다.
 * 메인넷에서는 절대 이 키를 사용하지 마세요.
 */

import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

const DEVNET_URL = 'https://api.devnet.solana.com';

async function main() {
  console.log('🔑 테스트넷 지갑 생성 중...\n');

  // 새 키페어 생성
  const wallet = Keypair.generate();
  
  console.log('✅ 지갑 생성 완료!');
  console.log(`📍 주소: ${wallet.publicKey.toBase58()}`);

  // 키 저장 (테스트넷 전용!)
  const keyPath = './devnet-wallet.json';
  fs.writeFileSync(keyPath, JSON.stringify(Array.from(wallet.secretKey)));
  console.log(`💾 키 저장: ${keyPath}`);
  console.log('⚠️  이 키는 테스트넷 전용입니다!\n');

  // Devnet SOL 에어드롭
  console.log('💰 테스트넷 SOL 에어드롭 요청 중...');
  const connection = new Connection(DEVNET_URL, 'confirmed');
  
  try {
    const signature = await connection.requestAirdrop(
      wallet.publicKey,
      2 * LAMPORTS_PER_SOL // 2 SOL
    );
    await connection.confirmTransaction(signature);
    
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`✅ 에어드롭 완료! 잔액: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (err) {
    console.log('⚠️  에어드롭 실패 (devnet 제한일 수 있음). 나중에 다시 시도하세요.');
    console.log(`에러: ${err.message}`);
  }
}

main().catch(console.error);
