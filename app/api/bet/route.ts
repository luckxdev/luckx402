import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { amount } = await request.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  return NextResponse.json(
    {
      amount: amount,
      recipient: "AeE5KdGNaapU3kArgmPNFVZMvrR5gZYWJAVZ741KZLMu",
      network: "solana",
      token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    { status: 402 }
  );
}