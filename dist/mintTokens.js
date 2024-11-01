"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNativeTokens = exports.burnTokens = exports.mintTokens = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize connection to Solana
const connection = new web3_js_1.Connection(process.env.SOLANA_RPC_URL, 'confirmed');
// Load mint authority and fee payer (for native SOL transfers) from environment variables
const mintAuthority = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.MINT_AUTHORITY_PRIVATE_KEY)));
const feePayer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.FEE_PAYER_PRIVATE_KEY)));
// Mint tokens function
const mintTokens = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fromAddress, toAddress, amount }) {
    try {
        console.log("Minting tokens");
        const mintPublicKey = new web3_js_1.PublicKey(process.env.TOKEN_MINT_ADDRESS);
        const recipientPublicKey = new web3_js_1.PublicKey(toAddress);
        console.log(`Mint Public Key: ${mintPublicKey.toBase58()}`);
        console.log(`Recipient Public Key: ${recipientPublicKey.toBase58()}`);
        ;
        // Get or create the recipient's associated token account
        const recipientTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintAuthority, mintPublicKey, recipientPublicKey);
        // Mint tokens to the recipient's token account
        yield (0, spl_token_1.mintTo)(connection, mintAuthority, mintPublicKey, recipientTokenAccount.address, mintAuthority, amount * Math.pow(10, Number(process.env.TOKEN_DECIMALS)) // Adjust for token decimals
        );
        console.log(`Minted ${amount} tokens to ${recipientTokenAccount.address.toBase58()}`);
    }
    catch (error) {
        console.error('Error minting tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
});
exports.mintTokens = mintTokens;
// Burn tokens function
const burnTokens = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fromAddress, toAddress, amount }) {
    try {
        console.log("Burning tokens");
        const mintPublicKey = new web3_js_1.PublicKey(process.env.TOKEN_MINT_ADDRESS);
        const userTokenAccount = new web3_js_1.PublicKey(fromAddress);
        // Burn tokens from the user's token account
        yield (0, spl_token_1.burn)(connection, mintAuthority, userTokenAccount, mintPublicKey, mintAuthority, amount * Math.pow(10, Number(process.env.TOKEN_DECIMALS)) // Adjust for token decimals
        );
        console.log(`Burned ${amount} tokens from ${userTokenAccount.toBase58()}`);
    }
    catch (error) {
        console.error('Error burning tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
});
exports.burnTokens = burnTokens;
// Send native SOL tokens function
const sendNativeTokens = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fromAddress, toAddress, amount }) {
    try {
        console.log("Sending native tokens");
        const senderPublicKey = new web3_js_1.PublicKey(fromAddress);
        const recipientPublicKey = new web3_js_1.PublicKey(toAddress);
        // Create a transaction to transfer SOL
        const transactionSignature = yield connection.requestAirdrop(recipientPublicKey, amount * web3_js_1.LAMPORTS_PER_SOL);
        // Confirm the transaction
        yield connection.confirmTransaction(transactionSignature);
        console.log(`Sent ${amount} SOL from ${fromAddress} to ${toAddress}`);
    }
    catch (error) {
        console.error('Error sending native tokens:', error);
        throw error; // Propagate error for the outer catch block
    }
});
exports.sendNativeTokens = sendNativeTokens;
