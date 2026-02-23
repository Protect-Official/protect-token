/**
 * $PROTECT — TransferFee 테스트
 * 
 * 테스트 시나리오:
 * 1. 두 번째 지갑 생성
 * 2. 토큰 전송 (수수료 발생 확인)
 * 3. 수수료 수집 (harvest + withdraw)
 * 
 * Run: node 3-test-transfer-fee.mjs
 * Requires: token-2022-info.json (from 2-create-token-2022.mjs)
 */

import {
  Connection, Keypair, Transaction, LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedWithFeeInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
  getTransferFeeAmount,
  harvestWithheldTokensToMint,
  withdrawWithheldTokensFromMint,
} from '@solana/spl-token';
import fs from 'fs';

const DEVNET_URL = 'https://api.devnet.solana.com';

async function main() {
  // Load config
  const tokenInfo = JSON.parse(fs.readFileSync('./token-2022-info.json', 'utf8'));
  const keyData = JSON.parse(fs.readFileSync('./devnet-wallet.json', 'utf8'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(keyData));
  const connection = new Connection(DEVNET_URL, 'confirmed');
  const mintPubkey = new (await import('@solana/web3.js')).PublicKey(tokenInfo.mint);

  console.log('=== $PROTECT TransferFee 테스트 ===\n');

  // Step 1: Create second wallet
  const receiver = Keypair.generate();
  console.log(`📬 수신자 지갑: ${receiver.publicKey.toBase58()}`);
  
  // Fund receiver for rent
  const airdropSig = await connection.requestAirdrop(receiver.publicKey, 0.1 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig);
  console.log('✅ 수신자에게 0.1 SOL 에어드롭\n');

  // Step 2: Create receiver's token account
  const receiverAta = getAssociatedTokenAddressSync(
    mintPubkey, receiver.publicKey, false,
    TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const tx1 = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey, receiverAta, receiver.publicKey, mintPubkey,
      TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  );
  await sendAndConfirmTransaction(connection, tx1, [wallet]);
  console.log(`✅ 수신자 토큰 계정: ${receiverAta.toBase58()}\n`);

  // Step 3: Transfer with fee
  const transferAmount = BigInt(10_000) * BigInt(10 ** tokenInfo.decimals); // 10,000 tokens
  const expectedFee = (transferAmount * BigInt(150)) / BigInt(10_000); // 1.5%
  
  console.log(`📤 전송: 10,000 $PROTECT`);
  console.log(`📊 예상 수수료: ${Number(expectedFee) / 10 ** tokenInfo.decimals} $PROTECT (1.5%)\n`);

  const senderAta = getAssociatedTokenAddressSync(
    mintPubkey, wallet.publicKey, false,
    TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const tx2 = new Transaction().add(
    createTransferCheckedWithFeeInstruction(
      senderAta,
      mintPubkey,
      receiverAta,
      wallet.publicKey,
      transferAmount,
      tokenInfo.decimals,
      expectedFee,
      [],
      TOKEN_2022_PROGRAM_ID,
    ),
  );
  const sig = await sendAndConfirmTransaction(connection, tx2, [wallet]);
  console.log(`✅ 전송 완료! TX: ${sig}\n`);

  // Step 4: Check balances & withheld fees
  const receiverAccount = await getAccount(connection, receiverAta, 'confirmed', TOKEN_2022_PROGRAM_ID);
  const feeAmount = getTransferFeeAmount(receiverAccount);

  console.log(`📊 결과:`);
  console.log(`   수신자 잔액: ${Number(receiverAccount.amount) / 10 ** tokenInfo.decimals} $PROTECT`);
  console.log(`   원천징수 수수료: ${feeAmount ? Number(feeAmount.withheldAmount) / 10 ** tokenInfo.decimals : 0} $PROTECT`);

  // Step 5: Harvest fees to mint
  console.log('\n🌾 수수료 수집 (harvest to mint)...');
  await harvestWithheldTokensToMint(
    connection, wallet, mintPubkey, [receiverAta], TOKEN_2022_PROGRAM_ID,
  );
  console.log('✅ 수수료가 민트 계정으로 수집됨');

  // Step 6: Withdraw fees to donation wallet (= sender wallet for now)
  console.log('💰 수수료 인출 (withdraw to donation wallet)...');
  await withdrawWithheldTokensFromMint(
    connection, wallet, mintPubkey, senderAta, wallet, [], TOKEN_2022_PROGRAM_ID,
  );
  console.log('✅ 수수료 인출 완료!\n');

  const finalAccount = await getAccount(connection, senderAta, 'confirmed', TOKEN_2022_PROGRAM_ID);
  console.log(`💰 기부 지갑 최종 잔액: ${Number(finalAccount.amount) / 10 ** tokenInfo.decimals} $PROTECT`);
  console.log('\n🎉 TransferFee 테스트 성공! 수수료가 정상적으로 수집됩니다.');
}

main().catch(console.error);
