require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle incoming requests
app.post('/helius', async (req, res) => {
    const { fromAddress, toAddress, amount } = req.body;
    const type = "received_native_sol"; // This could be dynamic based on your logic

    // Input validation
    if (!fromAddress || !toAddress || !amount) {
        return res.status(400).send('Invalid request: Missing parameters');
    }

    try {
        if (type === "received_native_sol") {
            // Mint tokens when native SOL is received
            await mintTokens(fromAddress, toAddress, amount);
        } else {
            // Handle other types of transactions
            await burnTokens(fromAddress, toAddress, amount);
            await sendNativeTokens(fromAddress, toAddress, amount);
        }

        res.status(200).send('Transaction successful');
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).send('Transaction failed');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});