import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, burn } from '@solana/spl-token';
import dotenv from 'dotenv';

dotenv.config();

// Initialize connection to Solana
const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');

// Load mint authority and fee payer (for native SOL transfers) from environment variables
const mintAuthority = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.MINT_AUTHORITY_PRIVATE_KEY!))
);
const feePayer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.FEE_PAYER_PRIVATE_KEY!))
);

interface MintTokensParams {
    fromAddress: string;
    toAddress: string;
    amount: number;
}

// Mint tokens function
export const mintTokens = async ({ fromAddress, toAddress, amount }: MintTokensParams): Promise<void> => {
    try {
        console.log("Minting tokens");
        
        
        const mintPublicKey = new PublicKey(process.env.TOKEN_MINT_ADDRESS!);
        const recipientPublicKey = new PublicKey(toAddress)
        console.log(`Mint Public Key: ${mintPublicKey.toBase58()}`);
console.log(`Recipient Public Key: ${recipientPublicKey.toBase58()}`);;

        // Get or create the recipient's associated token account
        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            mintAuthority,
            mintPublicKey,
            recipientPublicKey
        );

        // Mint tokens to the recipient's token account
        await mintTo(
            connection,
            mintAuthority,
            mintPublicKey,
            recipientTokenAccount.address,
            mintAuthority,
            amount * Math.pow(10, Number(process.env.TOKEN_DECIMALS)) // Adjust for token decimals
        );

        console.log(`Minted ${amount} tokens to ${recipientTokenAccount.address.toBase58()}`);
    } catch (error) {
        console.error('Error minting tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
};

interface BurnTokensParams {
    fromAddress: string;
    toAddress: string;
    amount: number;
}

// Burn tokens function
export const burnTokens = async ({ fromAddress, toAddress, amount }: BurnTokensParams): Promise<void> => {
    try {
        console.log("Burning tokens");

        const mintPublicKey = new PublicKey(process.env.TOKEN_MINT_ADDRESS!);
        const userTokenAccount = new PublicKey(fromAddress);

        // Burn tokens from the user's token account
        await burn(
            connection,
            mintAuthority,
            userTokenAccount,
            mintPublicKey,
            mintAuthority,
            amount * Math.pow(10, Number(process.env.TOKEN_DECIMALS)) // Adjust for token decimals
        );

        console.log(`Burned ${amount} tokens from ${userTokenAccount.toBase58()}`);
    } catch (error) {
        console.error('Error burning tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
};

interface SendNativeTokensParams {
    fromAddress: string;
    toAddress: string;
    amount: number;
}

// Send native SOL tokens function
export const sendNativeTokens = async ({ fromAddress, toAddress, amount }: SendNativeTokensParams): Promise<void> => {
    try {
        console.log("Sending native tokens");

        const senderPublicKey = new PublicKey(fromAddress);
        const recipientPublicKey = new PublicKey(toAddress);

        // Create a transaction to transfer SOL
        const transactionSignature = await connection.requestAirdrop(
            recipientPublicKey,
            amount * LAMPORTS_PER_SOL
        );

        // Confirm the transaction
        await connection.confirmTransaction(transactionSignature);

        console.log(`Sent ${amount} SOL from ${fromAddress} to ${toAddress}`);
    } catch (error) {
        console.error('Error sending native tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
};