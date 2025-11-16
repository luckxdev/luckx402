"use client";

import { useState } from "react";
import Link from "next/link";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

interface Card {
  suit: string;
  value: string;
}

const getCardValue = (card: Card) => {
  if (card.value === "A") return 11;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  return parseInt(card.value);
};

const calculateHandValue = (hand: Card[]) => {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    value += getCardValue(card);
    if (card.value === "A") aces++;
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
};

export default function Demo() {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState("betting");
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    setWalletConnected(true);
    setMessage("Wallet connected (simulated)");
  };

  const payWithX402 = async () => {
    setMessage("Processing x402 payment...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage("Payment confirmed! Starting game...");
    setPaymentData(null);
    startGame();
  };

  const startGame = () => {
    setBalance(prev => prev - bet);
    const newDeck = [...deck];
    const playerCard1 = newDeck.pop();
    const playerCard2 = newDeck.pop();
    const dealerCard1 = newDeck.pop();
    const dealerCard2 = newDeck.pop();
    if (!playerCard1 || !playerCard2 || !dealerCard1 || !dealerCard2) return;

    const player = [playerCard1, playerCard2];
    const dealer = [dealerCard1, dealerCard2];
    setPlayerHand(player);
    setDealerHand(dealer);
    setDeck(newDeck);
    setGameState("playing");
    setMessage("");

    if (calculateHandValue(player) === 21) {
      setGameState("blackjack");
      const win = Math.floor(bet * 1.5);
      setBalance(prev => prev + bet + win);
      setMessage(`Blackjack! You won ${win}!`);
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    if (!newCard) return;
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setGameState("bust");
      setMessage("Bust! You lose.");
    } else if (value === 21) {
      stand();
    }
  };

  const stand = () => {
    let dealerCards = [...dealerHand];
    let currentDeck = [...deck];

    while (calculateHandValue(dealerCards) < 17) {
      const card = currentDeck.pop();
      if (card) dealerCards.push(card);
    }

    setDealerHand(dealerCards);
    setDeck(currentDeck);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerCards);

    setTimeout(() => {
      if (dealerValue > 21) {
        setGameState("win");
        setBalance(prev => prev + bet * 2);
        setMessage("Dealer busts! You win!");
      } else if (dealerValue > playerValue) {
        setGameState("lose");
        setMessage("Dealer wins!");
      } else if (dealerValue < playerValue) {
        setGameState("win");
        setBalance(prev => prev + bet * 2);
        setMessage("You win!");
      } else {
        setGameState("push");
        setBalance(prev => prev + bet);
        setMessage("Push!");
      }
    }, 1000);
  };

  const newGame = () => {
    setGameState("betting");
    setPlayerHand([]);
    setDealerHand([]);
    setDeck(createDeck());
    setMessage("");
  };

  const placeBet = async () => {
    if (!walletConnected) {
      setMessage("Please connect your wallet first");
      return;
    }

    if (balance < bet) {
      setMessage("Insufficient balance");
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: bet }),
      });

      if (response.status === 402) {
        const data = await response.json();
        setPaymentData(data);
        setMessage(`x402 Payment Required: ${data.amount} USDC to ${data.recipient.slice(0, 10)}...`);
        return;
      }

      if (!response.ok) {
        throw new Error("Bet failed");
      }

      startGame();
    } catch (error) {
      setMessage("Error placing bet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <Link href="/" className="text-yellow-400 hover:text-yellow-300 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Blackjack Demo
        </h1>
        {!walletConnected && (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full mb-6 transition-all duration-300"
          >
            Connect Wallet
          </button>
        )}
        {walletConnected && (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="text-2xl mb-4">Balance: ${balance}</div>

            {gameState === "betting" && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Bet Amount: ${bet}</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                {!paymentData && (
                  <button
                    onClick={placeBet}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Place Bet
                  </button>
                )}
                {paymentData && (
                  <div className="mb-4">
                    <p className="mb-2">Pay {paymentData.amount} USDC to {paymentData.recipient.slice(0, 12)}...</p>
                    <button
                      onClick={payWithX402}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
                    >
                      Pay with x402
                    </button>
                  </div>
                )}
              </div>
            )}

            {(gameState === "playing" || gameState === "blackjack" || gameState === "bust" || gameState === "win" || gameState === "lose" || gameState === "push") && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl mb-2">Dealer: {calculateHandValue(dealerHand)}</h3>
                  <div className="flex justify-center space-x-2 mb-4">
                    {dealerHand.map((card, index) => (
                      <div key={index} className="bg-white text-black rounded-lg p-2 min-w-[60px] text-center">
                        {card.value}{card.suit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl mb-2">Player: {calculateHandValue(playerHand)}</h3>
                  <div className="flex justify-center space-x-2">
                    {playerHand.map((card, index) => (
                      <div key={index} className="bg-white text-black rounded-lg p-2 min-w-[60px] text-center">
                        {card.value}{card.suit}
                      </div>
                    ))}
                  </div>
                </div>

                {gameState === "playing" && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={hit}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
                    >
                      Hit
                    </button>
                    <button
                      onClick={stand}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
                    >
                      Stand
                    </button>
                  </div>
                )}

                {(gameState === "blackjack" || gameState === "bust" || gameState === "win" || gameState === "lose" || gameState === "push") && (
                  <button
                    onClick={newGame}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full"
                  >
                    New Game
                  </button>
                )}
              </div>
            )}

            {message && <div className="mt-4 text-lg font-bold">{message}</div>}
          </div>
        )}
        <div className="text-sm text-gray-300 mt-4">
          This demo simulates x402 payments. In a real implementation, bets would trigger on-chain transactions.
        </div>
      </div>
    </div>
  );
}