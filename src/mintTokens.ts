
import {
    Connection,
    Keypair,
    PublicKey,
} from '@solana/web3.js';
import {
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from '@solana/spl-token';

export const mintTokens = async (connection: Connection, payer: Keypair, mintAddress: PublicKey, recipientAddress: PublicKey, amount: number) => {
    console.log("Minting tokens");

    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintAddress,
        recipientAddress
    );

    await mintTo(
        connection,
        payer,
        mintAddress,
        recipientTokenAccount.address,
        payer.publicKey,
        amount 
    );

    console.log(`Minted ${amount} tokens to ${recipientAddress.toString()}`);
};

export const burnTokens = async (fromAddress: PublicKey, toAddress: PublicKey, amount: number) => {
    console.log("Burning tokens");
   
};


export const sendNativeTokens = async (fromAddress: PublicKey, toAddress: PublicKey, amount: number) => {
    console.log("Sending native tokens");
    
};