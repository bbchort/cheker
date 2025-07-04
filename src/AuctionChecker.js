import React, { useState } from "react";

function AuctionChecker() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuction = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "spotDeployState",
          coin: token.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (data?.gasAuction) {
        const { startTimeSeconds, durationSeconds, startGas, endGas } = data.gasAuction;

        const date = new Date(startTimeSeconds * 1000);
        const endDate = new Date((startTimeSeconds + durationSeconds) * 1000);

        setResult({
          date: date.toLocaleString(),
          endDate: endDate.toLocaleString(),
          startGas,
          endGas: endGas || "ещё не завершился",
        });
      } else {
        setResult({ error: "Аукцион не найден или токен не поддержи
