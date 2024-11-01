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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const app = (0, express_1.default)();
app.post('/helius', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    const type = "received_native_sol";
    console.log(`Received transaction from ${fromAddress} to ${toAddress} of ${amount} SOL`);
    if (type === "received_native_sol") {
        yield (0, mintTokens_1.mintTokens)(fromAddress, toAddress, amount);
    }
    else {
        // What could go wrong here?
        //any other event could be sent to this endpoint and you'll still burn tokens and send sol.
        yield (0, mintTokens_1.burnTokens)(fromAddress, toAddress, amount);
        yield (0, mintTokens_1.sendNativeTokens)(fromAddress, toAddress, amount);
    }
    res.send('Transaction successful');
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
