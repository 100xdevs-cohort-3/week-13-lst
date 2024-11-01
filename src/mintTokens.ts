import {
  createBurnCheckedInstruction,
  createMintToCheckedInstruction,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { PRIVATE_KEY, VAULT_ADDRESS, TOKEN_MINT_ADDRESS } from "./address";
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const mintAddress = new PublicKey(TOKEN_MINT_ADDRESS);
const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

export const mintTokens = async (fromAddress: string, amount: number) => {
  console.log("Minting tokens");
  //whats the point of toAddress here?

  //get users pubkey
  const recipientPublicKey = new PublicKey(fromAddress);

  //check if ATA exists or create
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAddress,
    recipientPublicKey
  );

  const transaction = new Transaction().add(
    createMintToCheckedInstruction(
      mintAddress,
      recipientTokenAccount.address,
      payer.publicKey, // Auth
      amount * 1e9, // Amount in lamp
      9
    )
  );
  const txSignature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log("Minted tokens with tx:", txSignature);
};

export const burnTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Burning tokens");
  //again, what's the point of any Address here?
  const myVault = new PublicKey(VAULT_ADDRESS);

  const transaction = new Transaction().add(
    // Burn the tokens
    createBurnCheckedInstruction(
      myVault,
      mintAddress,
      payer.publicKey,
      amount * 1e9,
      9
    )
  );

  const txSignature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log("Burned tokens with tx:", txSignature);
};

export const sendNativeTokens = async (toAddress: string, amount: number) => {
  const recipientPublicKey = new PublicKey(toAddress);
  console.log("Sending native tokens");
  const transaction = new Transaction().add(
    createTransferInstruction(
      payer.publicKey,
      recipientPublicKey,
      payer.publicKey,
      amount * 1e9
    )
  );

  const txSignature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log("Sent sol with tx:", txSignature);
};
