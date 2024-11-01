require('dotenv').config();
import express from 'express';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';

const app = express();
app.use(express.json()); // Ensure you can parse JSON request bodies

app.post('/helius', async (req, res) => {

    
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    const type = "received_native_sol"; // You may want to dynamically set this based on your application logic

    try {
        if (type === "received_native_sol") {
            await mintTokens({ fromAddress, toAddress, amount });
        } else {
            await burnTokens({ fromAddress, toAddress, amount });
            await sendNativeTokens({ fromAddress, toAddress, amount });
        }

        res.send('Transaction successful');
    } catch (error) {
        console.error('Transaction failed:', error);
        res.status(500).send('Transaction failed');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});