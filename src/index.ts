require("dotenv").config();
import express from "express";
import { burnTokens, mintTokens, sendNativeTokens } from "./mintTokens";
import { PUBLIC_KEY } from "./address";

const app = express();

app.post("/helius", async (req, res) => {
  const data = req.body[0];
  const { amount, fromUserAccount, toUserAccount } = data.nativeTransfers[0];

  if (toUserAccount !== PUBLIC_KEY) {
    res.json({
      message: "Processed",
    });
    return;
  }

  if (data.type === "TRANSFER") {
    await mintTokens(fromUserAccount, toUserAccount, amount);
  } else {
    await burnTokens(fromUserAccount, toUserAccount, amount);
    await sendNativeTokens(fromUserAccount, toUserAccount, amount);
  }

  res.send("Transaction successful");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
