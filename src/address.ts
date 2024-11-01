export const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
export const PUBLIC_KEY = process.env.PUBLIC_KEY as string;

export const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT_ADDRESS as string;
export const TOKEN_MINT_DECIMALS = parseInt(
  process.env.TOKEN_MINT_DECIMALS || "9"
) as number;
