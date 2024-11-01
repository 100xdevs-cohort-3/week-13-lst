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
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const address_1 = require("./address");
const bs58_1 = __importDefault(require("bs58"));
const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
const mintAddress = new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS);
const payer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(address_1.PRIVATE_KEY));
const mintTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Minting tokens");
    //whats the point of fromAddress here?
    const recipientPublicKey = new web3_js_1.PublicKey(toAddress);
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createMintToCheckedInstruction)(mintAddress, recipientPublicKey, payer.publicKey, // Auth
    amount * 1e9, // Amount in lamp
    9));
    const txSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        payer,
    ]);
    console.log("Minted tokens with tx:", txSignature);
});
exports.mintTokens = mintTokens;
const burnTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Burning tokens");
    const tokenAccountPublicKey = new web3_js_1.PublicKey(fromAddress); //hsol ATA
    //again, what's the point of toAddress here?
    const transaction = new web3_js_1.Transaction().add(
    // Burn the tokens
    (0, spl_token_1.createBurnCheckedInstruction)(tokenAccountPublicKey, mintAddress, payer.publicKey, amount * 1e9, 9));
    const txSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        payer,
    ]);
    console.log("Burned tokens with tx:", txSignature);
});
exports.burnTokens = burnTokens;
const sendNativeTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const recipientPublicKey = new web3_js_1.PublicKey(fromAddress);
    //which address to send sol to? confused.
    console.log("Sending native tokens");
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(payer.publicKey, recipientPublicKey, payer.publicKey, amount * 1e9));
    const txSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        payer,
    ]);
    console.log("Sent sol with tx:", txSignature);
});
exports.sendNativeTokens = sendNativeTokens;
