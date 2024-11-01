require('dotenv').config();
import express from 'express';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';

const app = express();


app.post('/helius', async(req, res) => {
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    const type = "received_native_sol";

    console.log(`Received transaction from ${fromAddress} to ${toAddress} of ${amount} SOL`);

    if (type === "received_native_sol") {
        await mintTokens(fromAddress, amount);
    } else {
        // What could go wrong here?
        //any other event could be sent to this endpoint and you'll still burn tokens and send sol.
        await burnTokens(fromAddress, toAddress, amount);
        await sendNativeTokens(fromAddress, toAddress, amount);
    }

    res.send('Transaction successful');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});