"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: "🎰", text: "Place Bet" },
    { icon: "💳", text: "x402 Payment" },
    { icon: "⚡", text: "Instant Transaction" },
    { icon: "🎲", text: "Play Game" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              luckx402
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-light">
              The Future Standard for Casino Payments
            </p>
            <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Pioneering x402 protocol integration to revolutionize how casinos handle transactions.
              Experience seamless, autonomous payments that will define the next generation of gaming.
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                How x402 Transforms Casino Gaming
              </h2>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl transition-all duration-500 transform ${
                      index === currentStep
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-600 scale-110 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-4xl mb-2">{step.icon}</div>
                    <div className={`text-sm font-semibold ${index === currentStep ? 'text-black' : 'text-white'}`}>
                      {step.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-400">🎯 Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed">
                    the luckx402 protocol aims to establish x402 as the global standard for casino payments.
                    By demonstrating seamless integration in this demo, we show how future casinos
                    can eliminate payment friction and enhance player experience through autonomous transactions.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-400">⚡ x402 Protocol</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The x402 protocol uses HTTP 402 status codes to trigger instant on-chain payments on Solana.
                    No more waiting for confirmations or dealing with traditional payment processors.
                    Experience true instant, feeless micropayments in gaming.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-4 text-green-400">🚀 Experience the Future</h2>
              <p className="text-lg mb-6 text-gray-300">
                This demo showcases how luckx402 will power the next generation of casinos.
                Play blackjack with x402 payments and see the seamless transaction flow that will
                become the industry standard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    🎲 Try the Demo
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
                <a
                  href="https://github.com/luckxdev/luckx402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:border-white/50"
                >
                  <span className="flex items-center justify-center">
                    📖 View Source
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400 mt-8">
            Open source • Built with Next.js • Powered by x402 protocol
          </div>
        </div>
      </div>
    </div>
  );
}
