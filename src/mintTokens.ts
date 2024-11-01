import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "./address";
import * as TokenProgram from "@solana/spl-token";

import bs58 from "bs58";
export const mintTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  const secret = new Uint8Array(bs58.decode(PRIVATE_KEY));
  const wallet = Keypair.fromSecretKey(secret);
  const mint = new PublicKey(TOKEN_MINT_ADDRESS);

  const tokenAccount = await TokenProgram.getOrCreateAssociatedTokenAccount(
    getConnection(),
    wallet,
    mint,
    wallet.publicKey
  );

  await TokenProgram.mintTo(
    getConnection(),
    wallet,
    tokenAccount.mint,
    tokenAccount.address,
    wallet.publicKey,
    amount
  );
};

export const burnTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Burning tokens");
};

export const sendNativeTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Sending native tokens");
};

function getConnection(): Connection {
  return new Connection("https://api.devnet.solana.com");
}
